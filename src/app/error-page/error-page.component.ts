import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Url } from '../constant/app-url';

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
})
export class ErrorPageComponent {
    title = '';
    shortDescription = '';
    longDescription = '';

    constructor(route: ActivatedRoute, private router: Router) {
        this.title = route.snapshot.data['title'];
        this.shortDescription = route.snapshot.data['shortDescription'];
        this.longDescription = route.snapshot.data['longDescription'];
    }

    homePage() {
        this.router.navigate([Url.HOME]);
    }
}
