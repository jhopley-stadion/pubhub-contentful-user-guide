import { ContentType } from './content-types';

export type ContentTypeGuides = Partial<Record<ContentType, string | null>>;

export type AppConfig = {
  defaultLocale: string;
  developmentEnvironment: string;
  contentTypeGuides: ContentTypeGuides;
  labels: Record<string, string>;
};

export type ContentTypeGuide = Partial<Record<ContentType, {
  defaultGuideId: string;
  guideId: string | null;
}>>

export type AppInstallationParameters = {
  contentTypeGuides?: ContentTypeGuide;
}

