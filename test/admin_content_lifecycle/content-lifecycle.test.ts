import { expect } from "chai";
import { describe, it } from "mocha";
import { NextRequest } from "next/server";

import { ContentLifecycleService } from "../../app/services/content-life-cycle";
import { PATCH } from "../../app/api/attractions/[id]/status/route";
import { encodeSession, SESSION_COOKIE } from "../../lib/auth";

describe("Admin content lifecycle functional tests", () => {
  describe("ContentLifecycleService", () => {
    it("TC-CL-01: publishes a draft", () => {
      expect(ContentLifecycleService.publish("DRAFT")).to.equal("PUBLISHED");
    });

    it("TC-CL-02: archives a draft", () => {
      expect(ContentLifecycleService.archive("DRAFT")).to.equal("ARCHIVED");
    });

    it("TC-CL-03: archives published content", () => {
      expect(ContentLifecycleService.archive("PUBLISHED")).to.equal("ARCHIVED");
    });

    it("TC-CL-04: rejects publishing already published content", () => {
      expect(() => ContentLifecycleService.publish("PUBLISHED")).to.throw(
        "Content is already published",
      );
    });

    it("TC-CL-05: rejects publishing archived content", () => {
      expect(() => ContentLifecycleService.publish("ARCHIVED")).to.throw(
        "Cannot publish an archived content",
      );
    });

    it("TC-CL-06: rejects archiving already archived content", () => {
      expect(() => ContentLifecycleService.archive("ARCHIVED")).to.throw(
        "Content is already archived",
      );
    });
  });

  describe("PATCH /api/attractions/[id]/status authorization", () => {
    async function patchStatus(
      id: string,
      role?: "admin" | "traveller",
      body = JSON.stringify({ action: "publish" }),
    ): Promise<Response> {
      const headers = new Headers({ "Content-Type": "application/json" });

      if (role) {
        headers.set(
          "Cookie",
          `${SESSION_COOKIE}=${encodeSession({
            id: "000000000000000000000001",
            role,
          })}`,
        );
      }

      const request = new NextRequest(
        `http://localhost/api/attractions/${id}/status`,
        {
          method: "PATCH",
          headers,
          body,
        },
      );

      return PATCH(request, { params: Promise.resolve({ id }) });
    }

    it("TC-API-01 NEGATIVE: rejects requests without a session", async () => {
      const response = await patchStatus("not-an-object-id");

      expect(response.status).to.equal(401);
      expect(await response.json()).to.deep.equal({
        success: false,
        error: "Admin access required",
      });
    });

    it("TC-API-02 NEGATIVE: rejects a traveller session", async () => {
      const response = await patchStatus("not-an-object-id", "traveller");

      expect(response.status).to.equal(401);
      expect(await response.json()).to.deep.equal({
        success: false,
        error: "Admin access required",
      });
    });

    it("TC-API-03: lets an admin proceed to attraction ID validation", async () => {
      const response = await patchStatus("not-an-object-id", "admin");

      expect(response.status).to.equal(400);
      expect(await response.json()).to.deep.equal({
        success: false,
        error: "Invalid attraction id",
      });
    });

    it("TC-API-04 NEGATIVE: rejects unsupported lifecycle actions", async () => {
      const response = await patchStatus(
        "000000000000000000000001",
        "admin",
        JSON.stringify({ action: "delete" }),
      );

      expect(response.status).to.equal(400);
      expect(await response.json()).to.deep.equal({
        success: false,
        error: "Action must be 'publish' or 'archive'",
      });
    });

    it("TC-API-05 NEGATIVE: rejects malformed JSON bodies", async () => {
      const response = await patchStatus(
        "000000000000000000000001",
        "admin",
        "{invalid-json",
      );

      expect(response.status).to.equal(400);
      expect(await response.json()).to.deep.equal({
        success: false,
        error: "Request body must be valid JSON",
      });
    });
  });
});
