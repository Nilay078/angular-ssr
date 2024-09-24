import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { ViewResponse } from 'src/app/common/interfaces/response';
import { Url } from 'src/app/constant/app-url';
import { Pattern } from 'src/app/constant/pattern';
import { HeaderActiveService } from 'src/app/shared/components/services/header-active-class-service';
import { HomeService } from '../home.service';

@Component({
    selector: 'app-join-waitlist',
    templateUrl: './join-waitlist.component.html',
    styleUrls: ['./join-waitlist.component.scss'],
})
export class JoinWaitlistComponent implements OnInit, OnDestroy {
    appUrl = Url;
    changeResolutionFlag!: boolean;
    joinWaitListForm: FormGroup;

    constructor(
        private headerActiveService: HeaderActiveService,
        private modalService: NgbModal,
        private renderer: Renderer2,
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private fb: FormBuilder,
        private cookieService: SsrCookieService,
        private homeService: HomeService
    ) {
        this.joinWaitListForm = this.fb.group({
            mobile: new FormControl(null, [Validators.required, Validators.pattern(Pattern.mobile.pattern)]),
        });
    }

    ngOnInit(): void {
        this.cookieService.delete('waitListMessage');
        this.breakpointObserver.observe(['(max-width: 767px)']).subscribe((result: BreakpointState) => {
            if (result.matches) {
                this.headerActiveService.changeActiveClass(true);
                this.headerActiveService.changeOpenHeader(true);
                this.headerActiveService.changeActiveHeader(true);
            }
        });

        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
    }

    onWaitListSave() {
        if (this.joinWaitListForm.invalid) {
            return;
        }
        this.homeService.saveWaitList(this.joinWaitListForm.value).then((response: ViewResponse) => {
            this.router.navigate([Url.SUCCESS_WAIT_LIST]);
            this.cookieService.set('waitListMessage', response.message);
            this.joinWaitListForm.controls['mobile'].setValue('');
            this.modalService.dismissAll();
            this.renderer.addClass(document.body, 'remove-overflow-css');
        });
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
