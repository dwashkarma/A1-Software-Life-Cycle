import type { ContentContext } from "./context";
import type { ContentStatus } from "./content-state";

export class ArchivedState implements ContentStatus {
  publish(content: ContentContext): void {
    throw new Error("Cannot publish an archived content");
  }

  archive(content: ContentContext): void {
    throw new Error("Content is already archived");
  }

  getStatus(): "ARCHIVED" {
    return "ARCHIVED" as const;
  }
}
