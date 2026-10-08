import { ContentState } from "./content-state";

export class ContentContext {
  private contentState: ContentState;

  constructor(state: ContentState) {
    this.contentState = state;
  }

  setContentState(state: ContentState) {
    this.contentState = state;
  }

  publishContent() {
    this.contentState.publish(this);
  }
  archiveContent() {
    this.contentState.archive(this);
  }
  getStatus() {
    return this.contentState.getStatus();
  }
}
