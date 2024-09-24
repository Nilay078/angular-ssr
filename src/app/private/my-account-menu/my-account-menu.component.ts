import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';

@Component({
    selector: 'app-my-account-menu',
    templateUrl: './my-account-menu.component.html',
    styleUrls: ['./my-account-menu.component.scss'],
})
export class MyAccountMenuComponent {
    appUrl = Url;
    url: string;

    constructor(private router: Router) {
        this.url = this.router.url;
    }
}
