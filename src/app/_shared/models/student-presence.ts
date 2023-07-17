import {ContactInfo} from "./contact-info";

export interface StudentPresence {
  student:ContactInfo;
  present:boolean;
  dateOfChecking:Date;
}
