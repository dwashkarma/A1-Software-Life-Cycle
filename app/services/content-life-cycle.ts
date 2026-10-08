import { ArchivedState } from "../contents/archieve-state";
import type { ContentState } from "../contents/content-state";
import { ContentContext } from "../contents/context";
import { DraftState } from "../contents/draft-state";
import { PublishState } from "../contents/publish-state";

export class ContentLifecycleService {
  private static createContext(status: ContentState): ContentContext {
    switch (status) {
      case "DRAFT":
        return new ContentContext(new DraftState());

      case "PUBLISHED":
        return new ContentContext(new PublishState());

      case "ARCHIVED":
        return new ContentContext(new ArchivedState());

      default:
        throw new Error("Invalid content status");
    }
  }

  static publish(status: ContentState): ContentState {
    const context = this.createContext(status);

    context.publish();

    return context.getStatus();
  }

  static archive(status: ContentState): ContentState {
    const context = this.createContext(status);

    context.archive();

    return context.getStatus();
  }
}
