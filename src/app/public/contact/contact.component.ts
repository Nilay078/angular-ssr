import { ViewResponse } from 'src/app/common/interfaces/response';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { HomeService } from '../home.service';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { Pattern } from 'src/app/constant/pattern';
import { KeyValue } from 'src/app/common/interfaces/entities/entity';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { SEOService } from 'src/app/seo.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    providers: [HomeService],
})
export class ContactComponent implements OnInit, OnDestroy {
    changeResolutionFlag!: boolean;
    contactForm: FormGroup;
    breadcrumbs: KeyValue[] = [];

    constructor(
        private headerActiveService: HeaderActiveService,
        private homeService: HomeService,
        private snackbarService: SnackBarService,
        private router: Router,
        private fb: FormBuilder,
        private cookieService: SsrCookieService,
        private seoService: SEOService
    ) {
        this.contactForm = this.fb.group({
            email: new FormControl(null, [Validators.required, Validators.pattern(Pattern.email.pattern)]),
            message: new FormControl(null, [Validators.required]),
        });
        this.breadcrumbs = [
            { key: 'Home', value: Url.HOME },
            { key: 'Contact Us', value: '' },
        ];
        const metaData: any = {};
        metaData.metaTitle = 'Contact US - The Secretariat News';
        metaData.metaDescription = 'Get in touch with The Secretariat today!';
        this.seoService.updateMetaData(metaData);
    }

    ngOnInit(): void {
        this.headerActiveService.changeActiveClass(true);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.headerActiveService.changeActiveClass(true);
        this.cookieService.set('previousUrl', Url.MORE);
    }

    onBackPage() {
        this.headerActiveService.changeActiveClass(false);
        this.router.navigate([Url.MORE]);
    }

    onSubmit() {
        if (this.contactForm.invalid) {
            return;
        } else {
            this.homeService.contactUs(this.contactForm.value).then((response: ViewResponse) => {
                this.snackbarService.successSnackBar(response.message);
                this.router.navigate([Url.HOME]);
            });
        }
    }

    ngOnDestroy(): void {
        this.cookieService.delete('previousUrl');
        this.headerActiveService.changeActiveClass(false);
    }
}
