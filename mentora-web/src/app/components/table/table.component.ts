import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Meta } from '@services/responses/shared/list-item.response';

@Component({
  selector: 'app-table',
  imports: [NgxSkeletonLoaderModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent {
  readonly meta = input<Meta>();
  readonly loading = input(false);
  readonly pageChange = output<number>();

  readonly pageNumbers = computed(() => {
    const totalPages = this.meta()?.totalPages ?? 0;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  });

  goToPage(page: number): void {
    this.pageChange.emit(page);
  }
}
