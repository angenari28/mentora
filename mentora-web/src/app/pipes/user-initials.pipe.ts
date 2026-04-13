import { Pipe } from '@angular/core';

@Pipe({
  name: 'userInitials',
  standalone: true,
})
export class UserInitialsPipe {
  public transform(userName: string): string {
    const user = (userName as string)
      .split(' ')
      .map((namePart) => namePart.charAt(0).toUpperCase())
      .join('');

    return user.trim().length === 1
      ? `${(userName as string).at(0)?.toUpperCase()}${(userName as string).at(1)?.toUpperCase() || ''}`
      : user;
  }
}
