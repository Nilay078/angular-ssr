import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from '../filter/filter.component';

@Component({
    selector: 'app-private-header',
    templateUrl: './private-header.component.html',
    styleUrls: ['./private-header.component.scss'],
})
export class PrivateHeaderComponent {
    @Input() pageName!: string;
    @Input() bookmarkFilter!: boolean;
    @Output() back = new EventEmitter();

    constructor(private modalService: NgbModal) {}

    onBack() {
        this.back.emit();
    }

    onOpen() {
        this.modalService.dismissAll();
        this.modalService.open(FilterComponent, { backdrop: 'static', size: 'lg', centered: true });
    }
}
