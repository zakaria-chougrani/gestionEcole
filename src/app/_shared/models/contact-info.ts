import {GenderEnum, StatusEnum, TaskEnum, TypeContractEnum} from "../enum";

export interface ContactInfo {
  id?:string;
  imageByte?:string;
  tagId?: string;
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
  task?: TaskEnum;
  specialties?: string[];
  startOfInsurance?: Date;
  expirationOfInsurance?: Date;
  status?:StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
