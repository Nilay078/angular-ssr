import { Injectable } from '@angular/core';
import { ListResponse, ViewResponse } from '../common/interfaces/response';
import { ApiUrl } from '../constant/app-url';
import { HttpService } from '../services/http.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    constructor(private httpService: HttpService, private cookieService: SsrCookieService, private route: ActivatedRoute) {}

    articleData(data: any): Promise<ListResponse> {
        if (this.cookieService.check('auth-token') && this.cookieService.check('userId')) {
            return this.httpService.getAuth<ListResponse>(`${ApiUrl.PRIVATE_ARTICLE_LAYOUT_API}/${data}`, true);
        } else {
            return this.httpService.get<ListResponse>(`${ApiUrl.PUBLIC_ARTICLE_LAYOUT_API}/${data}`, true);
        }
    }

    articleTypeData(data: any, start: number, recordSize: number): Promise<ListResponse> {
        const params = `start=${start}&recordSize=${recordSize}`;
        if (this.cookieService.check('auth-token')) {
            return this.httpService.postAuth<ListResponse>(`${ApiUrl.PRIVATE_ARTICLE_LAYOUT_API}?${params}`, data, true);
        } else {
            return this.httpService.get<ListResponse>(`${ApiUrl.PUBLIC_ARTICLE_LAYOUT_API}/${data}`, true);
        }
    }

    articleTagCategoryData(data: any, start: number, recordSize: number): Promise<ListResponse> {
        const params = `start=${start}&recordSize=${recordSize}`;
        if (this.cookieService.check('auth-token')) {
            return this.httpService.postAuth<ListResponse>(`${ApiUrl.PRIVATE_MOBILE_SEARCH}?${params}`, data, true);
        } else {
            return this.httpService.post<ListResponse>(`${ApiUrl.PUBLIC_MOBILE_SEARCH}?${params}`, data, true);
        }
    }

    articleView(slugName: string): Promise<ViewResponse> {
        if (this.cookieService.check('auth-token')) {
            return this.httpService.getAuth<ViewResponse>(`${ApiUrl.PRIVATE_ARTICLE_VIEW}/${slugName}`, true);
        } else {
            return this.httpService.get<ViewResponse>(`${ApiUrl.PUBLIC_ARTICLE_VIEW}/${slugName}`, true);
        }
    }

    register(data: any): Promise<ViewResponse> {
        return this.httpService.post<ViewResponse>(`${ApiUrl.USER_REGISTER}`, data);
    }

    userSave(data: any): Promise<ViewResponse> {
        return this.httpService.postAuth<ViewResponse>(`${ApiUrl.USER_SAVE}`, data);
    }

    contactUs(data: any): Promise<ViewResponse> {
        if (this.cookieService.check('auth-token')) {
            return this.httpService.postAuth<ViewResponse>(`${ApiUrl.PRIVATE_CONTACT_US}`, data);
        } else {
            return this.httpService.post<ViewResponse>(`${ApiUrl.PUBLIC_CONTACT_US}`, data);
        }
    }

    writeForUs(data: any): Promise<ViewResponse> {
        if (this.cookieService.check('auth-token')) {
            return this.httpService.postAuth<ViewResponse>(`${ApiUrl.PRIVATE_WRITE_FOR_US}`, data);
        } else {
            return this.httpService.post<ViewResponse>(`${ApiUrl.PUBLIC_WRITE_FOR_US}`, data);
        }
    }

    uploadFile(data: any): Promise<ViewResponse> {
        if (this.cookieService.check('auth-token')) {
            return this.httpService.postAuth<ViewResponse>(`${ApiUrl.PRIVATE_UPLOAD_FILE}`, data, true);
        } else {
            return this.httpService.post<ViewResponse>(`${ApiUrl.PUBLIC_UPLOAD_FILE}`, data, true);
        }
    }

    userUpdate(data: any): Promise<ViewResponse> {
        return this.httpService.putAuth<ViewResponse>(`${ApiUrl.USER_UPDATE}`, data);
    }

    categoryUpdate(data: any): Promise<ViewResponse> {
        return this.httpService.putAuth<ViewResponse>(`${ApiUrl.CATEGORY_UPDATE}`, data);
    }

    userView(id: number): Promise<ViewResponse> {
        return this.httpService.getAuth<ViewResponse>(`${ApiUrl.USER_VIEW}?id=${id}`);
    }

    resendOTP(): Promise<ViewResponse> {
        return this.httpService.getAuth<ViewResponse>(`${ApiUrl.RESEND_OTP_API}`).then((viewResponse: ViewResponse) => {
            return viewResponse;
        });
    }

    OTPVerification(data: number): Promise<ViewResponse> {
        return this.httpService.getAuth<ViewResponse>(`${ApiUrl.OTP_VERIFICATION_API}?otp=${data}`, true);
    }

    categorySearch(): Promise<ListResponse> {
        return this.httpService.get<ListResponse>(`${ApiUrl.PUBLIC_CATEGORY_SEARCH}`, true);
    }

    logout() {
        return this.httpService.getAuth<ViewResponse>(`${ApiUrl.LOGOUT_API}`);
    }

    codeVerification(code: number) {
        if (this.cookieService.check('auth-token')) {
            return this.httpService.getAuth<ViewResponse>(`${ApiUrl.PRIVATE_EXCLUSIVE_CODE_VERIFICATION}${code}`);
        } else {
            return this.httpService.get<ViewResponse>(`${ApiUrl.PUBLIC_EXCLUSIVE_CODE_VERIFICATION}${code}`);
        }
    }

    saveWaitList(data: any) {
        data.countryCode = { key: 91 };
        return this.httpService.post<ViewResponse>(`${ApiUrl.WAIT_LIST}`, data);
    }

    saveBookmark(articleId: number): Promise<ViewResponse> {
        return this.httpService.getAuth<ViewResponse>(`${ApiUrl.SAVE_BOOKMARK}?id=${articleId}`, true);
    }

    searchBookmark(startDate: string, endDate: string, categoryId: any): Promise<ListResponse> {
        const data: any = {};
        data.fromDate = startDate;
        data.toDate = endDate;
        data.categoryIds = categoryId;
        const params = `start=0&recordSize=`;
        return this.httpService.postAuth<ListResponse>(`${ApiUrl.SEARCH_BOOKMARK}?${params}`, data, true);
    }

    searchRecentView(): Promise<ListResponse> {
        const params = `start=0&recordSize=10`;
        if (this.cookieService.check('auth-token')) {
            return this.httpService.getAuth<ListResponse>(`${ApiUrl.PRIVATE_SEARCH_RECENT_VIEW}?${params}`);
        } else {
            return this.httpService.get<ListResponse>(`${ApiUrl.PUBLIC_SEARCH_RECENT_VIEW}?${params}`);
        }
    }

    feedBackDropDown(id: number): Promise<ListResponse> {
        if (this.cookieService.check('auth-token')) {
            return this.httpService.getAuth<ListResponse>(`${ApiUrl.PRIVATE_FEEDBACK_DROPDOWN}${id}`);
        } else {
            return this.httpService.get<ListResponse>(`${ApiUrl.PUBLIC_FEEDBACK_DROPDOWN}${id}`);
        }
    }

    saveFeedback(data: any): Promise<ViewResponse> {
        if (this.cookieService.check('auth-token')) {
            return this.httpService.postAuth<ViewResponse>(`${ApiUrl.PRIVATE_SAVE_FEEDBACK}`, data);
        } else {
            return this.httpService.post<ViewResponse>(`${ApiUrl.PUBLIC_SAVE_FEEDBACK}`, data);
        }
    }

    searchArticleFilterOptions(): Promise<ListResponse> {
        const params = `start=0&recordSize=`;
        if (this.cookieService.check('auth-token')) {
            return this.httpService.getAuth<ListResponse>(`${ApiUrl.PRIVATE_FILTER_OPTION}?${params}`);
        } else {
            return this.httpService.get<ListResponse>(`${ApiUrl.PUBLIC_FILTER_OPTION}?${params}`);
        }
    }

    searchArticleResults(searchData: any, start: number, recordSize: number): Promise<ListResponse> {
        const params = `start=${start}&recordSize=${recordSize}`;
        if (this.cookieService.check('auth-token')) {
            return this.httpService.postAuth<ListResponse>(`${ApiUrl.PRIVATE_SEARCH_ARTICLE_RESULT}?${params}`, searchData, true);
        } else {
            return this.httpService.post<ListResponse>(`${ApiUrl.PUBLIC_SEARCH_ARTICLE_RESULT}?${params}`, searchData, true);
        }
    }

    newsletterSubscribe(data: any): Promise<ViewResponse> {
        if (this.cookieService.check('auth-token')) {
            return this.httpService.postAuth<ViewResponse>(`${ApiUrl.PRIVATE_NEWSLETTER_SUBSCRIBE}`, data);
        } else {
            return this.httpService.post<ViewResponse>(`${ApiUrl.PUBLIC_NEWSLETTER_SUBSCRIBE}`, data);
        }
    }

    validateDeiceToken(): Promise<ViewResponse> {
        return this.httpService.get<ViewResponse>(`${ApiUrl.VALIDATE_DEVICE_TOKEN}`, true);
    }

    categoryWiseTagList(categoryId: number): Promise<ListResponse> {
        return this.httpService.get<ListResponse>(`${ApiUrl.CATEGORY_WISE_TAG_LIST}?categoryId=${categoryId}`, true);
    }

    stateListUser(): Promise<ListResponse> {
        return this.httpService.get<ListResponse>(`${ApiUrl.STATE_LIST_USER}`);
    }

    stateListSearch(): Promise<ListResponse> {
        let pageId!: number;
        switch (this.route.snapshot.params['slug']) {
            case 'daily-skim':
                pageId = 1;
                break;
            case 'deep-dive':
                pageId = 2;
                break;
        }
        const params = pageId ? `?newsType=${pageId}` : ``;
        return this.httpService.get<ListResponse>(`${ApiUrl.STATE_LIST_SEARCH}${params}`);
    }
}
