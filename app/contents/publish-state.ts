import { ArchivedState } from "./archieve-state";
import { ContentState } from "./content-state";

export class PublishState implements ContentState {
  publish(): void {
    throw new Error("Content is already published");
  }
  archive(content: any): void {
    content.setState(new ArchivedState());
  }
  getStatus(): "DRAFT" | "PUBLISHED" | "ARCHIVED" {
    return "PUBLISHED" as const;
  }
}
