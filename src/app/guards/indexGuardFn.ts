import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';

export const isLoggedGuardFn: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).loggedIn$.pipe(
    tap((res) => {
      if (!res) {
        router.navigate(['login']);
      }
    })
  );
};

export const canMatchGuardFn: CanMatchFn = () => {
  const router = inject(Router);
  return inject(AuthService).loggedIn$.pipe(
    tap((res) => {
      if (!res) {
        router.navigate(['login']);
      }
    })
  );
};
