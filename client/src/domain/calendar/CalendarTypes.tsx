import { DishListEntry } from "../dishes/DishTypes";

export type CalendarEvent = {
  _id: string;
  isRenderd: boolean;
  type: string;
  title: string;
  startDate: Date;
  endDate: Date;
  repeat: string;
  repeatUntil: Date;
  repeatDays: number[];
  skipRenderDays: Date[];
  description: string;
  meal: string;
  dishList: DishListEntry[];
};

export type NewCalendarEvent = Omit<CalendarEvent, "_id">;

export type VirtualCalendarEvent = Omit<CalendarEvent, "_id"> & {
  _id: string;
  isVirtual: boolean;
  _refid: CalendarEvent["_id"];
};

export type UIWrappedEvent = {
  eventObject: CalendarEvent;
  isVirtual: boolean;
  _baseID: string;
  _wrapID: string;
};
