export interface StudentPresenceAttendance {
  contactId:string;
  lastName:string;
  firstName:string;
  attendances:Attendance[]
}

export interface Attendance {
  date:Date;
  presentStatus:boolean;
}
