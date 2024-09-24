import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HeaderActiveService {
    private userData!: any;
    private active = new BehaviorSubject<boolean>(this.userData);
    activeClass = this.active.asObservable();

    private headerActive = new BehaviorSubject<boolean>(this.userData);
    activeHeader = this.headerActive.asObservable();

    private user = new BehaviorSubject<any>(this.userData);
    userView = this.user.asObservable();

    private searchBar = new BehaviorSubject<boolean>(this.userData);
    activeSearchBar = this.searchBar.asObservable();

    private publicPage = new BehaviorSubject<boolean>(this.userData);
    openHeader = this.publicPage.asObservable();

    private footerPage = new BehaviorSubject<boolean>(this.userData);
    hideFooter = this.footerPage.asObservable();

    changeOpenHeader(isPublic: boolean) {
        this.publicPage.next(isPublic);
    }

    showHideFooter(isHide: boolean) {
        this.footerPage.next(isHide);
    }

    changeActiveClass(activeValue: boolean) {
        this.active.next(activeValue);
    }

    changeActiveHeader(activeValue: boolean) {
        this.headerActive.next(activeValue);
    }

    changeUser(userData: any) {
        this.user.next(userData);
    }

    changeActiveSearchBar(hasSearch: boolean) {
        this.searchBar.next(hasSearch);
    }
}
