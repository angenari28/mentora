import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workloadHours',
  standalone: true,
})
export class WorkloadHoursPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '-';
    return `${value}h`;
  }
}
