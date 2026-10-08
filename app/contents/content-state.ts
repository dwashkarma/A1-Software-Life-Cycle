export interface ContentState {
  publish(content: any): void;
  archive(content: any): void;
  getStatus(): "DRAFT" | "PUBLISHED" | "ARCHIVED";
}
