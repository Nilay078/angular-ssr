import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import Utils from 'src/app/utility/utils';
import { HomeService } from '../home.service';
import { ListResponse, ViewResponse } from 'src/app/common/interfaces/response';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { KeyValue } from 'src/app/common/interfaces/entities/entity';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { FeedbackService } from 'src/app/shared/components/services/feedback.service';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss'],
    providers: [HomeService],
})
export class FeedbackComponent implements OnInit, OnDestroy {
    changeResolutionFlag!: boolean;
    appUrl = Url;
    productFeedback!: boolean;
    reportFeedback!: boolean;
    Feedback!: boolean;
    productFeedbackForm: FormGroup;
    bugFeedbackForm: FormGroup;
    utils = Utils;
    feedbackView: any;
    productDropDownList: any[] = [];
    bugDropDownList: any[] = [];
    feedbackRelatedList = [
        { value: 'Improvements', key: 1 },
        { value: 'Clippings', key: 2 },
    ];
    breadcrumbs: KeyValue[] = [];
    title = 'Feedback';

    constructor(
        private router: Router,
        private headerActiveService: HeaderActiveService,
        private fb: FormBuilder,
        private homeService: HomeService,
        private snackbarService: SnackBarService,
        private cookieService: SsrCookieService,
        private feedbackService: FeedbackService
    ) {
        this.productFeedbackForm = this.fb.group({
            type: new FormControl(null, Validators.required),
            message: new FormControl(null),
        });
        this.bugFeedbackForm = this.fb.group({
            type: new FormControl(null, Validators.required),
            message: new FormControl(null),
        });
        this.breadcrumbs = [
            { key: 'Home', value: Url.HOME },
            { key: 'Feedback', value: '' },
        ];
    }

    ngOnInit(): void {
        this.headerActiveService.changeActiveClass(true);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.cookieService.set('previousUrl', Url.MORE);
        this.feedbackService.feedback.subscribe(data => {
            if (data) {
                this.cookieService.delete('previousUrl');
                this.cookieService.set('previousUrl', Url.MORE);
                this.title = 'Feedback';
                this.productFeedback = false;
                this.reportFeedback = false;
            }
        });
    }

    onBackPage() {
        if (!this.reportFeedback && !this.productFeedback) {
            this.headerActiveService.changeActiveClass(false);
            this.router.navigate([Url.MORE]);
        }
        this.productFeedback = false;
        this.reportFeedback = false;
        this.breadcrumbs.pop();
        this.breadcrumbs[1].value = '';
    }

    onProduct() {
        this.productFeedback = true;
        this.reportFeedback = false;
        this.Feedback = false;
        this.homeService.feedBackDropDown(1).then((response: ListResponse) => {
            this.productDropDownList = response.list;
        });
        this.breadcrumbs[1].value = Url.FEEDBACK;
        this.breadcrumbs.push({ key: 'Product Feedback', value: '' });
        this.title = 'Product Feedback';
        this.cookieService.delete('previousUrl');
        this.cookieService.set('previousUrl', Url.FEEDBACK);
    }

    onReport() {
        this.productFeedback = false;
        this.reportFeedback = true;
        this.Feedback = false;
        this.homeService.feedBackDropDown(2).then((response: ListResponse) => {
            this.bugDropDownList = response.list;
        });
        this.breadcrumbs[1].value = Url.FEEDBACK;
        this.breadcrumbs.push({ key: 'Report Bug', value: '' });
        this.title = 'Report a Bug';
        this.cookieService.delete('previousUrl');
        this.cookieService.set('previousUrl', Url.FEEDBACK);
    }

    onSubmit(type: number) {
        if (type === 1) {
            const data: any = {};
            data.type = { id: type };
            data.feedbackType = { id: this.productFeedbackForm.controls['type'].value.key };
            data.message = this.productFeedbackForm.controls['message'].value;
            this.homeService.saveFeedback(data).then((response: ViewResponse) => {
                this.snackbarService.successSnackBar(response.message);
                this.productFeedbackForm.controls['type'].setValue(null);
                this.productFeedbackForm.controls['message'].setValue(null);
                this.onBackPage();
            });
        } else {
            const data: any = {};
            data.type = { id: type };
            data.bugType = { id: this.bugFeedbackForm.controls['type'].value.key };
            data.message = this.bugFeedbackForm.controls['message'].value;
            this.homeService.saveFeedback(data).then((response: ViewResponse) => {
                this.snackbarService.successSnackBar(response.message);
                this.bugFeedbackForm.controls['type'].setValue(null);
                this.bugFeedbackForm.controls['message'].setValue(null);
                this.onBackPage();
            });
        }
    }

    ngOnDestroy(): void {
        this.cookieService.delete('previousUrl');
        this.headerActiveService.changeActiveClass(false);
    }
}
