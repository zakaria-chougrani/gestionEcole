import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";
import { Location } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const location = inject(Location);
  if (state.url === '/login' && authService.isLoggedIn()) {
    router.navigate(['/']).then();
    return false;
  } else if (state.url !== '/login' && !location.path().startsWith('/check-presence/') && !authService.isLoggedIn()) {
    router.navigate(['/login']).then();
    return false;
  } else {
    return true;
  }
};
