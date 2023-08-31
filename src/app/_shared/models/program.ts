import {Level} from "./level";
import {ContactInfo} from "./contact-info";
import {Session} from "./session";
import {StatusEnum} from "../enum";

export interface Program {
  id:string;
  title:string;
  schoolYear:string;
  classLevel:Level;
  teacher:ContactInfo;
  sessions:Session[];
  students:ContactInfo[];
  status?:StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
