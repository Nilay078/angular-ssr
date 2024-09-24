import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-no-record-found',
    templateUrl: './no-record-found.component.html',
    styleUrls: ['./no-record-found.component.scss'],
})
export class NoRecordFoundComponent {
    @Input() hasBookmark!: boolean;
    @Input() hasRecentlyViewed!: boolean;
    @Output() addData = new EventEmitter();

    onAdd() {
        this.addData.emit();
    }
}
