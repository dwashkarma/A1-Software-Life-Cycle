import { ContentState } from "./content-state";
import { PublishState } from "./publish-state";

export class DraftState implements ContentState {
  publish(content: any): void {
    content.setState(new PublishState());
  }
  archive(content: any): void {
    throw new Error("Cannot archive a draft content");
  }
  getStatus(): "DRAFT" {
    return "DRAFT" as const;
  }
}
