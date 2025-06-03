export interface TimelineItem {
  Id: number;
  Episode: string;
  Title: string;
  Media: number;
  Description: string;
  Image: string;
  Icon: string;
  Audio: string;
  RemoteId: string;
  Status: number;
  isActive: number;
  inId: string;
  CreateDate: string;
  MediaName: string;
  Category: string;
  Epoch: number;
  AudioSize: number;
}

export interface BodyContent {
  Id: number;
  Background: string;
  BackgroundOpacity: number;
  About: string;
  JS: string;
  CSS: string | null;
  Status: number;
  createDate: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  Epoch: number;
}

export interface TimelineData {
  Body: BodyContent[];
  Timeline: TimelineItem[];
} 