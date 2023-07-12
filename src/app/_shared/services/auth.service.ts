import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'jwt_token';

  constructor(private router:Router) {
  }

  // Save token to local storage
  public saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token from local storage
  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token from local storage
  public removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Check if the user is logged in
  public isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null;
  }
  logout(){
    this.removeToken();
    this.router.navigateByUrl('login').then();
  }
}
