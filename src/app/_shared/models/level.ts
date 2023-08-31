import {SchoolClass} from "./school-class";
import {StatusEnum} from "../enum";

export interface Level {
  id:string;
  name:string;
  schoolClass: SchoolClass;
  description?: string;
  status?:StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
