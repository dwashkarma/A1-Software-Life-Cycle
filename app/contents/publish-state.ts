import { ArchivedState } from "./archieve-state";
import type { ContentStatus } from "./content-state";
import type { ContentContext } from "./context";

export class PublishState implements ContentStatus {
  publish(content: ContentContext): void {
    throw new Error("Content is already published");
  }

  archive(content: ContentContext): void {
    content.setState(new ArchivedState());
  }

  getStatus(): "PUBLISHED" {
    return "PUBLISHED" as const;
  }
}
