import {Level} from "./level";
import {Session} from "./session";
import {StatusEnum} from "../enum";

export interface ProgramDto {
  id:string;
  title:string;
  schoolYear:string;
  nbrStudent:number;
  classLevel:Level;
  teacherId:string;
  teacherFullName:string;
  teacherPhoneNumber:string;
  teacherImageByte:string;
  sessions:Session[];
  // students:ContactInfo[];
  status?:StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
