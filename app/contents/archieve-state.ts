import { type ContentStatus } from "./content-state";

export class ArchivedState implements ContentStatus {
  publish(): void {
    throw new Error("Cannot publish an archived content");
  }

  archive(): void {
    throw new Error("Content is already archived");
  }

  getStatus(): "ARCHIVED" {
    return "ARCHIVED" as const;
  }
}
