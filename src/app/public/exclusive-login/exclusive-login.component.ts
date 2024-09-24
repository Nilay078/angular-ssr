import { Component, OnInit } from '@angular/core';
import { Url } from 'src/app/constant/app-url';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { LoginComponent } from '../login/login.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../home.service';
import { ViewResponse } from 'src/app/common/interfaces/response';
import { Router } from '@angular/router';
import { Pattern } from 'src/app/constant/pattern';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { JoinWaitlistComponent } from '../join-waitlist/join-waitlist.component';
import { RegistrationComponent } from '../registration/registration.component';
import { AccessCode } from 'src/app/common/interfaces/entities/entity';

@Component({
    selector: 'app-exclusive-login',
    templateUrl: './exclusive-login.component.html',
    styleUrls: ['./exclusive-login.component.scss'],
    providers: [HomeService],
})
export class ExclusiveLoginComponent implements OnInit {
    appUrl = Url;
    changeResolutionFlag!: boolean;
    flag!: boolean;
    codeVerificationForm: FormGroup;

    constructor(
        private headerActiveService: HeaderActiveService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private homeService: HomeService,
        private router: Router,
        private cookieService: SsrCookieService
    ) {
        this.codeVerificationForm = this.fb.group({
            code: [
                null,
                [Validators.required, Validators.maxLength(6), Validators.minLength(6), Validators.pattern(Pattern.alphaNumeric.pattern)],
            ],
        });
    }

    ngOnInit(): void {
        this.cookieService.delete('waitListMessage');
        this.headerActiveService.changeActiveClass(true);
        this.headerActiveService.changeOpenHeader(true);
        this.headerActiveService.changeActiveHeader(true);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
    }

    gotoJoinWaitList() {
        this.modalService.open(JoinWaitlistComponent, { backdrop: 'static', size: 'lg', centered: true });
    }

    gotoLogin() {
        this.modalService.open(LoginComponent, { backdrop: 'static', size: 'lg', centered: true });
    }

    onVerify() {
        if (this.codeVerificationForm.invalid) {
            return;
        }
        this.homeService.codeVerification(this.codeVerificationForm.controls['code'].value).then((response: ViewResponse) => {
            const registerView = response.view as AccessCode;
            if (registerView) {
                const expiredDate = new Date();
                expiredDate.setDate(expiredDate.getDate() + 90);
                if (registerView.exclusiveCodeToken) {
                    this.cookieService.delete('exclusive-token');
                    this.cookieService.set('exclusive-token', registerView.exclusiveCodeToken, expiredDate);
                }
                if (this.changeResolutionFlag) {
                    this.router.navigate([Url.LOGIN]);
                } else {
                    this.modalService.open(RegistrationComponent, { backdrop: 'static', size: 'lg', centered: true });
                }
            } else if (this.cookieService.check('article-view-url')) {
                this.router.navigate([this.appUrl.ARTICLE_VIEW + '/' + this.cookieService.get('article-view-url')]);
            } else {
                this.router.navigate([this.appUrl.HOME]);
            }
        });
    }
}
