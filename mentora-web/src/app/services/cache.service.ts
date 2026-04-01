import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  addLocalStorage(key: cacheToken, value: {} | string): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorage(key: cacheToken): {} | string | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  removeLocalStorage(key: cacheToken): void {
    localStorage.removeItem(key);
  }
}

export const enum cacheToken {
  student_name = 'student_name',
  user_role = 'user_role',
}
