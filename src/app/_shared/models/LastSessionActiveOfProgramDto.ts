export interface StudentSessionDto {
  id:string;
  fullName:string;
  present:boolean;
  dateOfChecking:Date;
  imageByte:string;
}

export interface LastSessionActiveOfProgramDto {
  id:string;
  teacherComment:string;
  students:StudentSessionDto[];
}
