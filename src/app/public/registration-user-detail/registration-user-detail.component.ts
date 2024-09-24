import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { CategoryComponent } from '../category/category.component';
import { IdName, KeyValue } from 'src/app/common/interfaces/entities/entity';
import { RegisterUserService } from 'src/app/shared/components/services/register-user.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { Pattern } from 'src/app/constant/pattern';
import { HomeService } from '../home.service';
import Utils from 'src/app/utility/utils';
import * as _ from 'lodash';
import { ListResponse } from 'src/app/common/interfaces/response';

@Component({
    selector: 'app-registration-user-detail',
    templateUrl: './registration-user-detail.component.html',
    styleUrls: ['./registration-user-detail.component.scss'],
    providers: [HomeService],
})
export class RegistrationUserDetailComponent implements OnInit, OnDestroy {
    userRegistrationForm: FormGroup;
    changeResolutionFlag!: boolean;
    genderList = [
        { key: 1, value: 'Male' },
        { key: 2, value: 'Female' },
        { key: 3, value: 'Other' },
    ];
    selectedGender: any;
    mobileNumber!: number;
    hasMobile!: boolean;
    isSave = false;
    stateList: IdName[] = [];
    filteredStateList: IdName[] = [];
    utils = Utils;

    constructor(
        private headerActiveService: HeaderActiveService,
        private fb: FormBuilder,
        private router: Router,
        private modalService: NgbModal,
        private renderer: Renderer2,
        private registerUserService: RegisterUserService,
        private cookieService: SsrCookieService,
        private homeService: HomeService
    ) {
        this.userRegistrationForm = this.fb.group({
            firstName: new FormControl(null, [Validators.required]),
            lastName: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.pattern(Pattern.email.pattern)]),
            mobile: new FormControl(null, [Validators.pattern(Pattern.mobile.pattern)]),
            skimMode: new FormControl(null),
            deepDive: new FormControl(null),
            stateView: new FormControl(null, [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.renderer.removeClass(document.body, 'remove-overflow-css');
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        if (!this.changeResolutionFlag && this.router.url === Url.USER_REGISTRATION) {
            this.router.navigate([Url.HOME]);
        }
        const registerMobile: any = this.cookieService.get('registerMobile');
        const registerEmail: any = this.cookieService.get('registerEmail');
        this.hasMobile = this.cookieService.check('registerMobile');
        if (registerMobile) {
            this.userRegistrationForm.controls['mobile'].setValue(registerMobile);
        } else {
            this.userRegistrationForm.controls['email'].setValue(registerEmail);
        }
        this.headerActiveService.changeActiveClass(true);
        this.headerActiveService.changeOpenHeader(true);
        this.userRegistrationForm.controls['skimMode'].setValue(false);
        this.userRegistrationForm.controls['deepDive'].setValue(false);
        this.stateSearch();
    }

    stateSearch() {
        this.homeService.stateListUser().then((response: ListResponse) => {
            this.stateList = response.list as IdName[];
            this.filteredStateList = _.cloneDeep(this.stateList);
        });
    }

    onSelect(gender: KeyValue) {
        this.selectedGender = gender;
    }

    gotoCategory() {
        if (this.userRegistrationForm.invalid) {
            return;
        }
        this.isSave = true;
        let data: any = {};
        data = this.userRegistrationForm.value;
        // data.firstName = this.userRegistrationForm.controls['firstName'].value;
        // data.lastName = this.userRegistrationForm.controls['lastName'].value;
        // data.email = this.userRegistrationForm.controls['email'].value;
        // data.skimMode = this.userRegistrationForm.controls['skimMode'].value;
        // data.deepDive = this.userRegistrationForm.controls['deepDive'].value;
        data.gender = this.selectedGender;
        // data.mobile = this.userRegistrationForm.controls['registerMobileNumber'].value;
        // data.stateView = this.userRegistrationForm.controls['stateView'].value;
        this.registerUserService.changeUserView(data);
        this.homeService
            .userSave(data)
            .then(() => {
                if (this.changeResolutionFlag) {
                    this.router.navigate([Url.CATEGORY]);
                } else {
                    this.modalService.dismissAll();
                    this.modalService.open(CategoryComponent, { backdrop: 'static', size: 'lg', centered: true });
                }
            })
            .finally(() => {
                this.isSave = false;
            });
    }

    onClose() {
        this.modalService.dismissAll();
        this.renderer.addClass(document.body, 'remove-overflow-css');
    }

    ngOnDestroy(): void {
        this.headerActiveService.changeOpenHeader(false);
    }
}
