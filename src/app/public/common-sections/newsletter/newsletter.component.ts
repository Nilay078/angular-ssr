import { Component, Input, OnInit } from '@angular/core';
import { HomeService } from '../../home.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { ViewResponse } from 'src/app/common/interfaces/response';
import { SnackBarService } from 'src/app/shared/components/services/snackbar.service';
import { SubscriberDetailsComponent } from 'src/app/shared/components/subscriber-details/subscriber-details.component';

@Component({
    selector: 'app-newsletter',
    templateUrl: './newsletter.component.html',
    styleUrls: ['./newsletter.component.scss'],
    providers: [HomeService],
})
export class NewsletterComponent implements OnInit {
    @Input() layout!: number | null;
    @Input() data: any;
    changeResolutionFlag!: boolean;
    isNewsletterSubscribe = false;

    constructor(
        private cookieService: SsrCookieService,
        private modalService: NgbModal,
        private homeService: HomeService,
        private snackbarService: SnackBarService
    ) {}

    ngOnInit(): void {
        const isMobile: string = this.cookieService.get('isMobile');
        this.changeResolutionFlag = isMobile === 'true';
    }

    onSubscribe(newsletterIndex: number) {
        const data: any = {};
        data.newsLetterView = { id: newsletterIndex };
        this.isNewsletterSubscribe = true;
        if (!this.cookieService.check('auth-token')) {
            if (this.cookieService.check('subscriber_email')) {
                data.name = this.cookieService.get('subscriber_name');
                data.email = this.cookieService.get('subscriber_email');
            } else {
                const newsletterData = this.modalService.open(SubscriberDetailsComponent, {
                    backdrop: 'static',
                    size: 'lg',
                    centered: true,
                });
                newsletterData.componentInstance.newsletterId = newsletterIndex;
                return;
            }
        }
        this.homeService
            .newsletterSubscribe(data)
            .then((response: ViewResponse) => {
                this.snackbarService.successSnackBar(response.message);
            })
            .finally(() => {
                this.isNewsletterSubscribe = false;
            });
    }
}
