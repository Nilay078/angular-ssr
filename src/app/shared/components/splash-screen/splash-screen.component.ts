import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getWindow } from 'ssr-window';
import { Url } from 'src/app/constant/app-url';

@Component({
    selector: 'splash-screen',
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements OnInit {
    windowWidth!: string;
    showSplash = true;
    showSecondSplash = false;
    logo = 'splash-symbol.svg';
    constructor(private router: Router) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.showSplash = !this.showSplash;
            this.showSecondSplash = true;
        }, 2000);
        setTimeout(() => {
            this.windowWidth = '-' + getWindow().innerWidth + 'px';

            setTimeout(() => {
                this.showSecondSplash = !this.showSecondSplash;
                this.router.navigate([Url.HOME]);
            });
        }, 3500);
    }
}
