import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  addLocalStorage(key: string, value: {} | string): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorage(key: string): {} | string | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  removeLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }
}
