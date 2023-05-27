import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';
import { CanMatchFn, Router } from '@angular/router';

export const canMatchGuardFn: CanMatchFn = () => {
  const router = inject(Router);
  const loggedIn$ = inject(AuthService).loggedIn$;

  const redirect = async () => {
    await router.navigate(['/login']);
  };

  return loggedIn$.pipe(
    tap((res) => {
      if (!res) {
        (async () => {
          await redirect();
        })();
      }
    })
  );
};
