import {Program} from "./program";
import {StudentPresence} from "./student-presence";
import {StatusEnum} from "../enum";

export interface ProgramSession {
  id:string;
  program:Program;
  students:StudentPresence[];
  status:StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

