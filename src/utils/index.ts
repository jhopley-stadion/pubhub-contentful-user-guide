import { ContentType } from "../@types";

export const contentTypeIdToReadable = (contentType: ContentType) => (
  contentType
    .replace(/([a-z])([A-Z])/g, '$1 $2') 
    .replace(/^./, contentType => contentType.toUpperCase())
);
