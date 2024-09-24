import { Injectable } from '@angular/core';
import { ListResponse, ViewResponse } from '../common/interfaces/response';
import { ApiUrl } from '../constant/app-url';
import { HttpService } from '../services/http.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable()
export class PrivateService {
    constructor(private httpService: HttpService, private cookieService: SsrCookieService) {}

    userData(userId: number): Promise<ViewResponse> {
        return this.httpService.getAuth<ViewResponse>(`${ApiUrl.USER_VIEW}?id=${userId}`).then((response: ViewResponse) => {
            return response;
        });
    }

    profileUpdate(data: any): Promise<ViewResponse> {
        return this.httpService.putAuth<ViewResponse>(`${ApiUrl.PROFILE_UPDATE}`, data).then((response: ViewResponse) => {
            return response;
        });
    }

    newsletterSearch(): Promise<ListResponse> {
        const params = `start=0&recordSize=`;
        return this.httpService.postAuth<ListResponse>(`${ApiUrl.NEWSLETTER_SEARCH}?${params}`, {}).then((response: ListResponse) => {
            return response;
        });
    }

    updateUserState(data: any): Promise<ListResponse> {
        return this.httpService.postAuth<ListResponse>(`${ApiUrl.UPDATE_USER_STATE}`, data);
    }

    articleByState(data: any): Promise<ViewResponse> {
        const params = `stateId=${data.referenceId}&pageSectionId=${data.id}&pageId=${data.pageView.id}`;
        if (this.cookieService.check('auth-token')) {
            return this.httpService.getAuth<ViewResponse>(`${ApiUrl.PRIVATE_ARTICLE_BY_STATE}?${params}`);
        } else {
            return this.httpService.getAuth<ViewResponse>(`${ApiUrl.PUBLIC_ARTICLE_BY_STATE}?${params}`);
        }
    }
}
