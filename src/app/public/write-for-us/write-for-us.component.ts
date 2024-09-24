import { HomeService } from 'src/app/public/home.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { Router } from '@angular/router';
import { Url } from 'src/app/constant/app-url';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { ViewResponse } from 'src/app/common/interfaces/response';
import { Pattern } from 'src/app/constant/pattern';
import { KeyValue } from 'src/app/common/interfaces/entities/entity';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
    selector: 'app-write-for-us',
    templateUrl: './write-for-us.component.html',
    styleUrls: ['./write-for-us.component.scss'],
    providers: [HomeService],
})
export class WriteForUsComponent implements OnInit, OnDestroy {
    changeResolutionFlag!: boolean;
    writeUsForm: FormGroup;
    thumbnailImageChangedEvent: any;
    thumbnailBrowseFile = true;
    iconName!: any;
    fileId!: string;
    hasData = true;
    breadcrumbs: KeyValue[] = [];

    constructor(
        private headerActiveService: HeaderActiveService,
        private router: Router,
        private fb: FormBuilder,
        private snackbarService: SnackBarService,
        private homeService: HomeService,
        private cookieService: SsrCookieService
    ) {
        this.writeUsForm = this.fb.group({
            emailId: new FormControl(null, [Validators.required, Validators.pattern(Pattern.email.pattern)]),
            message: new FormControl(null, [Validators.required]),
            thumbnailImage: new FormControl(null),
        });
        this.breadcrumbs = [
            { key: 'Home', value: Url.HOME },
            { key: 'Write For Us', value: '' },
        ];
    }

    ngOnInit(): void {
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.headerActiveService.changeActiveClass(true);
        this.cookieService.set('previousUrl', Url.MORE);
    }

    onBackPage() {
        this.headerActiveService.changeActiveClass(false);
        this.router.navigate([Url.MORE]);
    }

    thumbnailFileChangeEvent(event: any): void {
        const file = event.target.files[0];
        if (file.size > 1500000) {
            this.writeUsForm.controls['thumbnailImage'].setValue(null);
            this.snackbarService.errorSnackBar('File size should be less than or equal to 1.5MB.');
        } else {
            this.hasData = false;
            const formData = new FormData();
            formData.append('file', file);
            this.homeService
                .uploadFile(formData)
                .then((response: ViewResponse) => {
                    if (!response.hasError) {
                        this.thumbnailImageChangedEvent = event;
                        this.thumbnailBrowseFile = false;
                        this.iconName = event.target.files[0].name;
                        const dataView: any = response.view;
                        this.fileId = dataView.fileId;
                    } else {
                        this.writeUsForm.controls['thumbnailImage'].setValue(null);
                        this.snackbarService.errorSnackBar(response.message);
                    }
                })
                .finally(() => {
                    this.hasData = true;
                });
        }
    }

    clearIcon() {
        delete this.iconName;
        this.writeUsForm.controls['thumbnailImage'].setValue(null);
    }

    onSubmit() {
        if (this.writeUsForm.invalid) {
            return;
        }
        const data: any = {};
        data.email = this.writeUsForm.controls['emailId'].value;
        data.message = this.writeUsForm.controls['message'].value;
        data.fileView = { fileId: this.fileId };
        this.homeService.writeForUs(data).then((response: ViewResponse) => {
            this.snackbarService.successSnackBar(response.message);
            this.writeUsForm.reset();
            this.router.navigate([Url.HOME]);
        });
    }

    ngOnDestroy(): void {
        this.cookieService.delete('previousUrl');
        this.headerActiveService.changeActiveClass(false);
    }
}
