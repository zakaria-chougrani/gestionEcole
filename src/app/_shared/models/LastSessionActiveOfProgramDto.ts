import {StudentSessionDto} from "./student-session-dto";

export interface LastSessionActiveOfProgramDto {
  id:string;
  teacherComment:string;
  students:StudentSessionDto[];
}
