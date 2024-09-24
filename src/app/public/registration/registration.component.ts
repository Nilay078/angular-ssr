import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';
import { VerificationComponent } from '../verification/verification.component';
import { HomeService } from '../home.service';
import { Pattern } from 'src/app/constant/pattern';
import { ViewResponse } from 'src/app/common/interfaces/response';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { RegisterType } from './register-type-enum';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
    providers: [HomeService],
})
export class RegistrationComponent implements OnInit {
    registrationForm: FormGroup;
    changeResolutionFlag!: boolean;
    clicked!: boolean;
    appUrl = Url;
    registerType = RegisterType;
    selectedType = this.registerType.EMAIL;
    registerTypeList = [
        { key: 1, value: 'Email' },
        { key: 2, value: 'Mobile' },
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private modalService: NgbModal,
        private homeService: HomeService,
        private snackbarService: SnackBarService,
        private renderer: Renderer2,
        public cookieService: SsrCookieService
    ) {
        this.registrationForm = this.fb.group({
            registerType: [this.registerType.EMAIL, Validators.required],
            registerMobileNumber: [null, Validators.pattern(Pattern.mobile.pattern)],
            email: [null, [Validators.required, Validators.pattern(Pattern.email.pattern)]],
        });
    }

    ngOnInit(): void {
        this.renderer.removeClass(document.body, 'remove-overflow-css');
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.cookieService.set('hasRegistrationBox', JSON.stringify(true));
    }

    gotoVerification() {
        if (this.registrationForm.invalid) {
            return;
        }
        this.clicked = true;
        const data: any = {};
        if (this.registrationForm.controls['registerMobileNumber'].value) {
            data.countryCode = { key: '+91' };
            data.mobile = this.registrationForm.controls['registerMobileNumber'].value;
        } else {
            data.email = this.registrationForm.controls['email'].value;
        }
        this.homeService
            .register(data)
            .then((response: ViewResponse) => {
                this.snackbarService.successSnackBar(response.message);
                const userView: any = response.view;
                this.cookieService.delete('registerMobile');
                this.cookieService.delete('registerEmail');
                const expiredDate = new Date();
                expiredDate.setDate(expiredDate.getDate() + 7);
                if (this.registrationForm.value.registerMobileNumber) {
                    this.cookieService.set('registerMobile', userView.mobile, expiredDate);
                } else {
                    this.cookieService.set('registerEmail', userView.email, expiredDate);
                }

                if (this.changeResolutionFlag) {
                    this.router.navigate([Url.VERIFICATION]);
                } else {
                    this.modalService.dismissAll();
                    this.modalService.open(VerificationComponent, { backdrop: 'static', size: 'lg', centered: true });
                }
            })
            .finally(() => {
                this.clicked = false;
            });
    }

    onTypeSelect(event: any) {
        this.selectedType = event.value.key;
        if (this.selectedType === this.registerType.EMAIL) {
            this.onEmailClick();
        } else {
            this.onMobileClick();
        }
    }

    onMobileClick() {
        this.registrationForm.controls['email'].setValue(null);
        this.registrationForm.controls['registerMobileNumber'].setValidators([
            Validators.required,
            Validators.pattern(Pattern.mobile.pattern),
        ]);
        this.registrationForm.controls['email'].clearValidators();
        this.registrationForm.controls['registerMobileNumber'].updateValueAndValidity();
        this.registrationForm.controls['email'].updateValueAndValidity();
    }

    onEmailClick() {
        this.registrationForm.controls['registerMobileNumber'].setValue(null);
        this.registrationForm.controls['email'].setValidators([Validators.required, Validators.pattern(Pattern.email.pattern)]);
        this.registrationForm.controls['registerMobileNumber'].clearValidators();
        this.registrationForm.controls['email'].updateValueAndValidity();
        this.registrationForm.controls['registerMobileNumber'].updateValueAndValidity();
    }

    onClose() {
        this.modalService.dismissAll();
        this.renderer.addClass(document.body, 'remove-overflow-css');
    }
}
