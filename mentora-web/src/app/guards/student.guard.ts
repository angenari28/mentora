import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CacheService, cacheToken } from '@services/cache.service';

export const studentGuard: CanActivateFn = () => {
  const cacheService = inject(CacheService);
  const router = inject(Router);

  const userName = cacheService.getLocalStorage(cacheToken.user_name);

  if (userName) {
    return true;
  }

  return router.createUrlTree(['/login-student']);
};
