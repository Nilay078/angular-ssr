import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Url } from 'src/app/constant/app-url';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Pattern } from 'src/app/constant/pattern';
import { Router } from '@angular/router';
import { RegistrationUserDetailComponent } from '../registration-user-detail/registration-user-detail.component';
import { RegistrationComponent } from '../registration/registration.component';
import { HomeService } from '../home.service';
import { ViewResponse } from 'src/app/common/interfaces/response';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { LoginComponent } from '../login/login.component';
import { NgOtpInputComponent } from 'ng-otp-input';
import { PrivateService } from 'src/app/private/private.service';
import { LocationSelectionComponent } from '../location-selection/location-selection.component';
import { getWindow } from 'ssr-window';

@Component({
    selector: 'app-verification',
    templateUrl: './verification.component.html',
    styleUrls: ['./verification.component.scss'],
    providers: [HomeService, PrivateService],
})
export class VerificationComponent implements OnInit, OnDestroy {
    @ViewChild(NgOtpInputComponent, { static: false }) ngOtpInput!: NgOtpInputComponent;
    appUrl = Url;
    verificationForm: FormGroup;
    readonly RESEND_OTP_TIMER: number = 1000;
    readonly RESEND_COUNT: number = 3;
    timeLeft = 0;
    sentCount = 0;
    clicked = false;
    changeResolutionFlag!: boolean;
    isDisabled = true;
    userRegisteredData: any;
    hasMobile = false;

    constructor(
        private headerActiveService: HeaderActiveService,
        private snackbarService: SnackBarService,
        private fb: FormBuilder,
        private router: Router,
        private modalService: NgbModal,
        private homeService: HomeService,
        private renderer: Renderer2,
        private cookieService: SsrCookieService,
        private privateService: PrivateService
    ) {
        this.verificationForm = this.fb.group({
            verificationOtp: new FormControl('', [
                Validators.required,
                Validators.pattern(Pattern.onlyNumeric.pattern),
                Validators.minLength(6),
                Validators.maxLength(6),
            ]),
        });
    }

    ngOnInit(): void {
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        if (!this.changeResolutionFlag && this.router.url === '/' + Url.VERIFICATION) {
            this.router.navigate([this.appUrl.HOME]);
        }
        const registerMobile: any = this.cookieService.get('registerMobile');
        const registerEmail: any = this.cookieService.get('registerEmail');
        this.hasMobile = registerMobile;
        if (registerMobile) {
            this.userRegisteredData = '+91' + '******' + JSON.stringify(registerMobile).substring(7, 11);
        } else {
            this.userRegisteredData =
                registerEmail.substring(0, 3) + '******' + registerEmail.substring(registerEmail.length - 5, registerEmail.length);
        }
        this.headerActiveService.changeActiveClass(true);
        this.headerActiveService.changeOpenHeader(true);
        this.cookieService.delete('userId');
        this.cookieService.delete('userFirstName');
        this.cookieService.delete('userLastName');
        this.timer();
    }

    onOtpChange(otp: string) {
        if (otp.length === 6) {
            this.verificationForm.controls['verificationOtp'].setValue(otp);
            this.isDisabled = false;
            // this.gotoUserRegistration();
        } else {
            this.isDisabled = true;
        }
    }

    timer() {
        this.timeLeft = 59;
        const interval = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft === 0) {
                clearInterval(interval);
            }
        }, this.RESEND_OTP_TIMER);
    }

    resendOtp() {
        if (this.sentCount === this.RESEND_COUNT) {
            this.snackbarService.errorSnackBar(
                'You have exceeded maximum limit for resend-OTP. Please go back and try again after sometime.'
            );
            return;
        } else {
            this.homeService.resendOTP().then(response => {
                this.sentCount++;
                this.timer();
                this.snackbarService.successSnackBar(response.message);
            });
        }
    }

    gotoUserRegistration() {
        this.clicked = true;
        this.homeService
            .OTPVerification(this.verificationForm.controls['verificationOtp'].value)
            .then((response: ViewResponse) => {
                const expiredDate = new Date();
                expiredDate.setDate(expiredDate.getDate() + 7);
                if (response.code === 2212 || response.code === 1008) {
                    this.snackbarService.successSnackBar(response.message);
                    if (this.changeResolutionFlag) {
                        this.router.navigate([Url.USER_REGISTRATION]);
                    } else {
                        this.modalService.dismissAll();
                        this.modalService.open(RegistrationUserDetailComponent, { backdrop: 'static', size: 'lg', centered: true });
                    }
                } else if (response.hasError) {
                    this.ngOtpInput.setValue(null);
                    this.snackbarService.errorSnackBar(response.message);
                } else {
                    this.modalService.dismissAll();
                    this.renderer.addClass(document.body, 'remove-overflow-css');
                    const userView: any = response.view;
                    this.cookieService.delete('userId');
                    this.cookieService.delete('userFirstName');
                    this.cookieService.delete('userLastName');
                    this.cookieService.delete('userMobile');
                    this.cookieService.delete('email');
                    this.cookieService.delete('state');
                    this.cookieService.delete('stateUpdated');
                    this.cookieService.set('userId', userView.id, expiredDate);
                    this.cookieService.set('userFirstName', userView.firstName, expiredDate);
                    this.cookieService.set('userLastName', userView.lastName, expiredDate);
                    this.cookieService.set('userMobile', userView.mobile, expiredDate);
                    this.cookieService.set('email', userView.email, expiredDate);
                    if (userView.stateUpdated) {
                        this.cookieService.set('stateUpdated', JSON.stringify(userView.stateUpdated), expiredDate);
                    }
                    if (userView.stateView) {
                        this.cookieService.set('state', JSON.stringify(userView.stateView), expiredDate);
                    }
                    if (response.accessToken) {
                        this.cookieService.delete('auth-token');
                        this.cookieService.set('auth-token', response.accessToken, expiredDate);
                    }
                    if (response.refreshToken) {
                        this.cookieService.delete('refresh-token');
                        this.cookieService.set('refresh-token', response.refreshToken, expiredDate);
                    }
                    this.headerActiveService.changeUser(response.view);
                    if (
                        this.cookieService.check('auth-token') &&
                        (!this.cookieService.check('stateUpdated') || !JSON.parse(this.cookieService.get('stateUpdated')))
                    ) {
                        if (this.changeResolutionFlag) {
                            this.router.navigate([this.appUrl.HOME]);
                        }
                        this.stateSelection();
                    } else {
                        if (this.changeResolutionFlag) {
                            this.router.navigate([this.appUrl.HOME]);
                        } else {
                            getWindow().location.reload();
                        }
                    }
                }
            })
            .finally(() => {
                this.clicked = false;
            });
    }

    private stateSelection() {
        this.privateService.userData(JSON.parse(this.cookieService.get('userId'))).then((response: ViewResponse) => {
            const userView: any = response.view;
            if (!userView.stateUpdated) {
                this.modalService.open(LocationSelectionComponent, { backdrop: 'static', size: 'lg', centered: true, keyboard: false });
            }
        });
    }

    openRegisterModal() {
        this.modalService.dismissAll();
        this.onClose();
        const isRegistration = this.cookieService.get('hasRegistrationBox');
        if (JSON.parse(isRegistration)) {
            this.modalService.open(RegistrationComponent, { backdrop: 'static', size: 'lg', centered: true });
        } else {
            this.modalService.open(LoginComponent, { backdrop: 'static', size: 'lg', centered: true });
        }
    }

    onClose() {
        this.modalService.dismissAll();
        this.renderer.addClass(document.body, 'remove-overflow-css');
    }

    ngOnDestroy(): void {
        this.headerActiveService.changeOpenHeader(false);
    }
}
