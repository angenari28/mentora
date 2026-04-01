import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CacheService, cacheToken } from '@services/cache.service';

export const backofficeGuard: CanActivateFn = () => {
  const cacheService = inject(CacheService);
  const router = inject(Router);

  const role = cacheService.getLocalStorage(cacheToken.user_role);

  if (role === 'master') {
    return true;
  }

  return router.createUrlTree(['/login']);
};
