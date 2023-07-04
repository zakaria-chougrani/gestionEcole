export interface ContactInfo {
  id?:string;
  imageByte?:string;
  firstName?: string;
  lastName?: string;
  gender?: GenderEnum;
  email?: string;
  phoneNumber?: string;
  scholarLevel?: string;
  dateOfBirth?: Date;
  contractStartDate?: Date;
  contractEndDate?: Date;
  typeOfContract?: TypeContractEnum;
  task?: taskEnum;
  specialties?: string[];
  startOfInsurance?: Date;
  expirationOfInsurance?: Date;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export enum GenderEnum {
  Male = 'male',
  Female = 'female'
}
export enum taskEnum {
  Staff = 'staff',
  trainee_staff = 'trainee_staff',
  Teacher = 'teacher',
  Student = 'student',
  trainee_student = 'trainee_student'
}
export enum TypeContractEnum{
  CDI,
  CDD
}
