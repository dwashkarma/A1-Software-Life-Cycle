import type { ContentContext } from "./context";

export type ContentState = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ContentStatus {
  publish(content: ContentContext): void;
  archive(content: ContentContext): void;
  getStatus(): ContentState;
}
  