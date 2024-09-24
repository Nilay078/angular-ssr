import { Url } from 'src/app/constant/app-url';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PrivateService } from './../private.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListResponse, ViewResponse } from 'src/app/common/interfaces/response';
import { IdName, KeyValue } from 'src/app/common/interfaces/entities/entity';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { Pattern } from 'src/app/constant/pattern';
import * as _ from 'lodash';
import Utils from 'src/app/utility/utils';
import { HomeService } from 'src/app/public/home.service';
import { Line100PercentBy70Theme } from 'src/app/constant/skeleton-theme';
import { getWindow } from 'ssr-window';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss'],
    providers: [PrivateService],
})
export class EditProfileComponent implements OnInit, OnDestroy {
    changeResolutionFlag!: boolean;
    userId!: number;
    userView: any;
    userForm: FormGroup;
    genderList = [
        { key: 1, value: 'Male' },
        { key: 2, value: 'Female' },
        { key: 3, value: 'Other' },
    ];
    selectedGender: any;
    breadcrumbs: KeyValue[] = [];
    stateList: IdName[] = [];
    filteredStateList: IdName[] = [];
    utils = Utils;
    hasData = false;
    thumbnailTheme = Line100PercentBy70Theme;

    constructor(
        private privateService: PrivateService,
        private fb: FormBuilder,
        private headerActiveService: HeaderActiveService,
        private router: Router,
        private snackbarService: SnackBarService,
        private cookieService: SsrCookieService,
        private homeService: HomeService
    ) {
        this.userForm = this.fb.group({
            firstName: new FormControl(null, [Validators.required]),
            lastName: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.pattern(Pattern.email.pattern)]),
            mobile: new FormControl(null, [Validators.pattern(Pattern.mobile.pattern)]),
            skimMode: new FormControl(null),
            deepDive: new FormControl(null),
            stateView: new FormControl(null, [Validators.required]),
        });
        this.breadcrumbs = [
            { key: 'Home', value: Url.HOME },
            { key: 'Edit Profile', value: '' },
        ];
    }

    ngOnInit(): void {
        this.headerActiveService.changeActiveClass(true);
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.cookieService.set('previousUrl', Url.MY_ACCOUNT);
        const user: any = this.cookieService.get('userId');
        this.userId = user;
        this.onSearch();
    }

    async stateSearch() {
        await this.homeService.stateListUser().then((response: ListResponse) => {
            this.stateList = response.list as IdName[];
            this.filteredStateList = _.cloneDeep(this.stateList);
        });
    }

    async onSearch() {
        this.hasData = false;
        await this.stateSearch();
        this.privateService
            .userData(this.userId)
            .then((response: ViewResponse) => {
                this.userView = response.view;
                this.selectedGender = this.userView.gender;
            })
            .finally(() => {
                this.hasData = true;
            });
    }

    onSelect(gender: KeyValue) {
        this.selectedGender = gender;
    }

    onBackPage() {
        this.headerActiveService.changeActiveClass(false);
        this.router.navigate([Url.MY_ACCOUNT]);
    }

    onUpdate() {
        if (this.userForm.invalid) {
            return;
        }
        if (!this.userForm.value.mobile && !this.userForm.value.email) {
            this.snackbarService.errorSnackBar('Please enter mobile number or email address.');
            return;
        }
        let data: any = {};
        data = this.userForm.value;
        data.gender = this.selectedGender;
        data.id = this.userView.id;
        this.privateService.profileUpdate(data).then((response: ViewResponse) => {
            if (this.userForm.value.mobile !== this.userView.mobile || this.userForm.value.email !== this.userView.email) {
                this.snackbarService.successSnackBar('Since you have modified your user id, you need to login again.');
                this.onLogout();
            } else {
                this.snackbarService.successSnackBar(response.message);
            }
        });
    }

    onLogout() {
        this.homeService.logout().then(() => {
            this.cookieService.deleteAll('/');
            setTimeout(() => {
                this.router.navigate([Url.HOME]);
                getWindow().location.reload();
            }, 1500);
        });
    }

    ngOnDestroy(): void {
        this.cookieService.delete('previousUrl');
    }
}
