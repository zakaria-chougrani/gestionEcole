import {SchoolClass} from "./school-class";

export interface Level {
  id:string;
  name:string;
  schoolClass: SchoolClass;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
