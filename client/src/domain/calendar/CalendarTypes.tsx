import { DishListEntry } from "../dishes/DishTypes";

export type CalendarEvent = {
  _id: string;
  type: string;
  title: string;
  startDate: Date;
  endDate: Date;
  repeat: string;
  repeatUntil: Date | null;
  repeatDays: number[];
  skipRenderDays: Date[];
  description: string;
  meal: string | null;
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

export type PlacedUIEvent = UIWrappedEvent & { col: number; cols: number };
