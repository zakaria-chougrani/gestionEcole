export interface ContactInfo {
  id?:string;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  email?: string;
  phoneNumber?: string;
  scholarLevel?: string;
  dateOfBirth?: Date;
  status?: Status;
  specialties?: string[];
}
export enum Gender {
  Male = 'male',
  Female = 'female'
}
export enum Status {
  Staff = 'staff',
  Teacher = 'teacher',
  Student = 'student',
  Stagiaire = 'stagiaire'
}
