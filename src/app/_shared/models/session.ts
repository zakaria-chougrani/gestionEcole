export interface Session {
  id:string;
  day:DayEnum;
  startOfSession:Time;
  endOfSession:Time;
}


export enum DayEnum {
  MONDAY='MONDAY',
  TUESDAY='TUESDAY',
  WEDNESDAY='WEDNESDAY',
  THURSDAY='THURSDAY',
  FRIDAY='FRIDAY',
  SATURDAY='SATURDAY',
  SUNDAY='SUNDAY'
}
export interface Time {
  hour: number;
  minute: number;
}
