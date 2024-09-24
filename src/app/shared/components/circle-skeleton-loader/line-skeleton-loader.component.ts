import { Component, Input } from '@angular/core';
import { NgxSkeletonLoaderConfigTheme } from 'ngx-skeleton-loader';

@Component({
    selector: 'app-line-skeleton-loader',
    template: `<ngx-skeleton-loader [hidden]="isHidden" appearance="line" animation="progress" [theme]="theme"> </ngx-skeleton-loader>`,
})
export class LineSkeletonLoaderComponent {
    @Input() isHidden = false;
    @Input() theme: NgxSkeletonLoaderConfigTheme = {};
}
