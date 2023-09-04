import {StatusEnum} from "../enum";

export interface SessionProgramHistory {
  id?:string;
  nbrStudentsPresent?:number;
  nbrStudentsAbsent?:number;
  status?:StatusEnum;
  createdAt?:Date;
  updatedAt?:Date;
  closedAt?:Date;
}
