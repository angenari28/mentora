import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CacheService, cacheToken } from '@services/cache.service';

export const studentGuard: CanActivateFn = () => {
  const cacheService = inject(CacheService);
  const router = inject(Router);

  const studentName = cacheService.getLocalStorage(cacheToken.student_name);

  if (studentName) {
    return true;
  }

  return router.createUrlTree(['/login-student']);
};
