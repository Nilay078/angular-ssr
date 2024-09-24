import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Url } from 'src/app/constant/app-url';
import { Pattern } from 'src/app/constant/pattern';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { HomeService } from '../home.service';
import { ViewResponse } from 'src/app/common/interfaces/response';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { VerificationComponent } from '../verification/verification.component';
import { Router } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { RegisterType } from '../registration/register-type-enum';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [HomeService],
})
export class LoginComponent implements OnInit, OnDestroy {
    mobileNumber!: number;
    changeResolutionFlag!: boolean;
    appUrl = Url;
    registrationForm: FormGroup;
    clicked!: boolean;
    hasMobile = false;
    registerType = RegisterType;
    selectedType = this.registerType.EMAIL;
    registerTypeList = [
        { key: 1, value: 'Email' },
        { key: 2, value: 'Mobile' },
    ];

    constructor(
        private headerActiveService: HeaderActiveService,
        private modalService: NgbModal,
        private renderer: Renderer2,
        private fb: FormBuilder,
        private homeService: HomeService,
        private snackbarService: SnackBarService,
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private cookieService: SsrCookieService
    ) {
        this.registrationForm = this.fb.group({
            registerType: null,
            registerMobileNumber: [null, Validators.pattern(Pattern.mobile.pattern)],
            email: [null, [Validators.required, Validators.pattern(Pattern.email.pattern)]],
        });
    }

    ngOnInit(): void {
        this.breakpointObserver.observe(['(max-width: 767px)']).subscribe((result: BreakpointState) => {
            if (result.matches) {
                this.headerActiveService.changeActiveClass(true);
                this.headerActiveService.changeOpenHeader(true);
                this.headerActiveService.changeActiveHeader(true);
            }
        });

        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.cookieService.set('hasRegistrationBox', JSON.stringify(false));
    }

    onKeyup() {
        const loginId = this.registrationForm.controls['registerLoginId'].value;
        if (this.registrationForm.controls['registerLoginId'].value) {
            if (!loginId.match(Pattern.email.pattern) || !loginId.match(Pattern.mobile.pattern)) {
                if (Number(loginId)) {
                    this.hasMobile = true;
                    this.registrationForm.controls['registerLoginId'].setValidators([
                        Validators.required,
                        Validators.pattern(Pattern.mobile.pattern),
                    ]);
                } else {
                    this.hasMobile = false;
                    this.registrationForm.controls['registerLoginId'].setValidators([
                        Validators.required,
                        Validators.pattern(Pattern.email.pattern),
                    ]);
                }
                this.registrationForm.controls['registerLoginId'].updateValueAndValidity();
            }
        } else {
            this.hasMobile = true;
        }
    }

    onSubmit() {
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

    ngOnDestroy(): void {
        this.headerActiveService.changeOpenHeader(false);
    }

    onBackPage() {
        this.headerActiveService.changeActiveClass(false);
        this.router.navigate([Url.EXCLUSIVE_LOGIN]);
    }
}
