import { Component, Input } from '@angular/core';
import { NgxSkeletonLoaderConfigTheme } from 'ngx-skeleton-loader';

@Component({
    selector: 'app-circle-skeleton-loader',
    template: `<ngx-skeleton-loader [hidden]="isHidden" appearance="circle" animation="progress" [theme]="theme"> </ngx-skeleton-loader>`,
})
export class CircleSkeletonLoaderComponent {
    @Input() isHidden = false;
    @Input() theme: NgxSkeletonLoaderConfigTheme = {};
}
