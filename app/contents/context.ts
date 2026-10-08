import type { ContentState, ContentStatus } from "./content-state";

export class ContentContext {
  private contentStatus: ContentStatus;

  constructor(state: ContentStatus) {
    this.contentStatus = state;
  }

  setState(state: ContentStatus) {
    this.contentStatus = state;
  }

  publish(): void {
    this.contentStatus.publish(this);
  }

  archive(): void {
    this.contentStatus.archive(this);
  }

  getStatus(): ContentState {
    return this.contentStatus.getStatus();
  }
}
