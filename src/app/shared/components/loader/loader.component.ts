import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
    @Input() count = 1;
    counters: number[] = [];

    ngOnInit(): void {
        this.counters = Array(this.count);
    }
}
