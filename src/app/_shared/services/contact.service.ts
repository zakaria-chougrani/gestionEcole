import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ContactInfo} from "../models/contact-info";
import {Observable, Subject} from "rxjs";
import {environment} from "../../../environments/environment";
import {Page} from "../models/page";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl+'contacts';

  private refreshContacts$ = new Subject<void>();

  get refreshContacts(): Observable<void> {
    return this.refreshContacts$.asObservable();
  }
  triggerRefreshContacts(): void {
    this.refreshContacts$.next();
  }
  constructor(private http: HttpClient) { }
  getAllContacts(pageIndex: number, pageSize: number, searchValue: string): Observable<Page<ContactInfo>> {
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('search', searchValue);

    return this.http.get<Page<ContactInfo>>(this.apiUrl, { params });
  }

  saveContact(contact: ContactInfo): Observable<ContactInfo> {
    return this.http.post<ContactInfo>(this.apiUrl, contact);
  }
  deleteContact(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
  getActiveTeachersBySearchValue(pageIndex: number, pageSize: number, searchValue: string): Observable<Page<ContactInfo>>{
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('search', searchValue);

    return this.http.get<Page<ContactInfo>>(`${this.apiUrl}/teachers`, { params });
  }

}
