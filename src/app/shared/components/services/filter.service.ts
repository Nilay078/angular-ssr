import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    private default!: any;

    private filteredData = new BehaviorSubject<any>(this.default);
    filterDataView = this.filteredData.asObservable();

    changeFilter(data: any) {
        this.filteredData.next(data);
    }
}
