import {Level} from "./level";
import {ContactInfo} from "./contact-info";
import {Session} from "./session";

export interface Program {
  id:string;
  title:string;
  schoolYear:string;
  classLevel:Level;
  teacher:ContactInfo;
  sessions:Session[];
  students:ContactInfo[];
  createdAt?: Date;
  updatedAt?: Date;
}
