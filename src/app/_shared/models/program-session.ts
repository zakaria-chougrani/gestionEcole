import {Program} from "./program";
import {StudentPresence} from "./student-presence";

export interface ProgramSession {
  id:string;
  program:Program;
  students:StudentPresence[];
  status:StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
export enum StatusEnum{
  ACTIVE,
  INACTIVE
}
