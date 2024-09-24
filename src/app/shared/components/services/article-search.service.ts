import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ArticleSearchService {
    private default!: string;

    private searchData = new BehaviorSubject<string>(this.default);
    filterSearchData = this.searchData.asObservable();

    changeSearch(data: string) {
        this.searchData.next(data);
    }
}
