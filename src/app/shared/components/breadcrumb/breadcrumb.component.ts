import { Component, Input } from '@angular/core';
import { KeyValue } from 'src/app/common/interfaces/entities/entity';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
    @Input() breadcrumbs: KeyValue[] = [];
}
