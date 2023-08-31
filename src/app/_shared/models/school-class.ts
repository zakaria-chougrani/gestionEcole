import {StatusEnum} from "../enum";

export interface SchoolClass {
  id: string;
  name: string;
  imageByte: string;
  status?:StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;

}
