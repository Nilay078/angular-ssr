import { Component, Input, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { ViewResponse } from 'src/app/common/interfaces/response';
import { HomeService } from 'src/app/public/home.service';
import { SnackBarService } from '../services/snackbar.service';
import { Pattern } from 'src/app/constant/pattern';

@Component({
    selector: 'app-subscriber-details',
    templateUrl: './subscriber-details.component.html',
    styleUrls: ['./subscriber-details.component.scss'],
    providers: [HomeService],
})
export class SubscriberDetailsComponent {
    @Input() newsletterId!: number;
    subscriberForm: FormGroup;
    isSubscribe = false;

    constructor(
        private modalService: NgbModal,
        private renderer: Renderer2,
        private fb: FormBuilder,
        private homeService: HomeService,
        private cookieService: SsrCookieService,
        private snackbarService: SnackBarService
    ) {
        this.subscriberForm = this.fb.group({
            name: [null, Validators.required],
            email: [null, [Validators.required, Validators.pattern(Pattern.email.pattern)]],
        });
    }

    onSubmit() {
        if (this.subscriberForm.invalid) {
            return;
        }
        let data: any = {};
        data = this.subscriberForm.value;
        data.newsLetterView = { id: this.newsletterId };
        this.isSubscribe = true;
        const expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() + 7);
        this.homeService
            .newsletterSubscribe(data)
            .then((response: ViewResponse) => {
                this.snackbarService.successSnackBar(response.message);
                this.cookieService.set('subscriber_email', this.subscriberForm.controls['email'].value, expiredDate);
                this.cookieService.set('subscriber_name', this.subscriberForm.controls['name'].value, expiredDate);
                this.onClose();
            })
            .finally(() => {
                this.isSubscribe = false;
            });
    }

    onClose() {
        this.modalService.dismissAll();
        this.renderer.addClass(document.body, 'remove-overflow-css');
    }
}
