import type { ContentContext } from "./context";
import { type ContentStatus } from "./content-state";
import { ArchivedState } from "./archieve-state";
import { PublishState } from "./publish-state";

export class DraftState implements ContentStatus {
  publish(content: ContentContext): void {
    content.setState(new PublishState());
  }

  archive(content: ContentContext): void {
    content.setState(new ArchivedState());
  }

  getStatus(): "DRAFT" {
    return "DRAFT" as const;
  }
}
