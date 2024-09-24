import { ViewResponse } from './../../common/interfaces/response';
import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { HomeService } from '../home.service';
import { ListResponse } from 'src/app/common/interfaces/response';
import { IdName } from 'src/app/common/interfaces/entities/entity';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Utils from 'src/app/utility/utils';
import { PrivateService } from 'src/app/private/private.service';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { getWindow } from 'ssr-window';

@Component({
    selector: 'app-location-selection',
    templateUrl: './location-selection.component.html',
    styleUrls: ['./location-selection.component.scss'],
    providers: [HomeService, PrivateService],
})
export class LocationSelectionComponent implements OnInit, OnDestroy {
    @ViewChild('openSuccessPopup') openSuccessPopup!: TemplateRef<ElementRef>;
    @Input() title = '';
    @Input() content = '';
    @Input() url: string | undefined;
    @Input() timer = 0;

    stateForm: FormGroup;
    changeResolutionFlag = false;
    stateList: IdName[] = [];
    filteredStateList: IdName[] = [];
    utils = Utils;
    hasResponse = true;

    constructor(
        private renderer: Renderer2,
        private cookieService: SsrCookieService,
        private fb: FormBuilder,
        private homeService: HomeService,
        private modalService: NgbModal,
        private privateService: PrivateService,
        private snackbarService: SnackBarService
    ) {
        this.stateForm = this.fb.group({
            stateView: null,
            id: cookieService.get('userId'),
        });
    }

    ngOnInit(): void {
        this.renderer.removeClass(document.body, 'remove-overflow-css');
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
        this.cookieService.set('hasRegistrationBox', JSON.stringify(true));
        this.stateSearch();
    }

    stateSearch() {
        this.homeService.stateListUser().then((response: ListResponse) => {
            this.stateList = response.list as IdName[];
            this.filteredStateList = _.cloneDeep(this.stateList);
        });
    }

    onSubmit() {
        this.hasResponse = false;
        this.privateService.updateUserState(this.stateForm.value).then((response: ViewResponse) => {
            this.cookieService.set('state', JSON.stringify(this.stateForm.value.stateView));
            this.cookieService.set('stateUpdated', JSON.stringify(true));
            this.snackbarService.successSnackBar(response.message);
            setTimeout(() => {
                this.onClose();
            }, 1500);
            getWindow().location.reload();
        });
    }

    onClose() {
        this.modalService.dismissAll();
        this.hasResponse = true;
        this.renderer.addClass(document.body, 'remove-overflow-css');
    }

    ngOnDestroy(): void {
        this.stateForm.controls['stateView'].setValue(
            this.cookieService.check('state') ? JSON.parse(this.cookieService.get('state')) : this.stateList[0]
        );
        this.onSubmit();
    }
}
