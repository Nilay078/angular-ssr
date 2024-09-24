import { formatDate } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ListResponse } from 'src/app/common/interfaces/response';
import { HomeService } from 'src/app/public/home.service';
import { FilterService } from 'src/app/shared/components/services/filter.service';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    providers: [HomeService],
})
export class FilterComponent implements OnInit {
    selectedCategory: any[] = [];
    selectedDate: any;
    categoryList: any[] = [];
    currentDate = new Date();

    dateList = [
        {
            key: 0,
            value: 'Today',
            selected: false,
            fromDate: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
            endDate: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        },
        {
            key: 1,
            value: 'This Week',
            selected: false,
            fromDate: formatDate(new Date(new Date().setDate(new Date().getDate() - this.currentDate.getDay())), 'dd-MM-yyyy', 'en'),
            endDate: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        },
        {
            key: 2,
            value: 'Last Week',
            selected: false,
            fromDate: formatDate(new Date(new Date().setDate(new Date().getDate() - 7 - this.currentDate.getDay())), 'dd-MM-yyyy', 'en'),
            endDate: formatDate(new Date(new Date().setDate(new Date().getDate() - this.currentDate.getDay() - 1)), 'dd-MM-yyyy', 'en'),
        },
        {
            key: 3,
            value: 'This Month',
            selected: false,
            fromDate: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'dd-MM-yyyy', 'en'),
            endDate: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
        },
        {
            key: 4,
            value: 'Last 3 Month',
            selected: false,
            fromDate: formatDate(new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1), 'dd-MM-yyyy', 'en'),
            endDate: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 0), 'dd-MM-yyyy', 'en'),
        },
        {
            key: 5,
            value: 'Last 6 Month',
            selected: false,
            fromDate: formatDate(new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1), 'dd-MM-yyyy', 'en'),
            endDate: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 0), 'dd-MM-yyyy', 'en'),
        },
    ];

    constructor(
        private modalService: NgbModal,
        private renderer: Renderer2,
        private homeService: HomeService,
        private filterService: FilterService
    ) {}

    ngOnInit(): void {
        this.renderer.removeClass(document.body, 'remove-overflow-css');
        this.filterService.filterDataView.subscribe((data: any) => {
            this.selectedCategory = data?.categoryValue ?? [];
            this.selectedDate = data?.dateValue ?? undefined;
            if (this.selectedDate) {
                this.dateList[this.selectedDate.key].selected = true;
            }
        });
        this.homeService.categorySearch().then((response: ListResponse) => {
            _.forEach(response.list, (category: any) => {
                category.selected = false;
                _.forEach(this.selectedCategory, (filteredCategory: any) => {
                    if (filteredCategory.id === category.id) {
                        category.selected = true;
                    }
                });
                this.categoryList.push(category);
            });
        });
    }

    onClose() {
        this.modalService.dismissAll();
        this.renderer.addClass(document.body, 'remove-overflow-css');
    }

    onReset() {
        this.dateList[this.selectedDate.key].selected = false;
        _.forEach(this.categoryList, (category: any) => {
            category.selected = false;
        });
        this.selectedCategory = [];
        this.selectedDate = undefined;
    }

    selectionChange(category: any) {
        category.selected = !category.selected;
    }

    selectionDateChange(date: any) {
        console.log(date);
        _.forEach(this.dateList, (dateView: any) => {
            if (dateView.key === date.key) {
                dateView.selected = !dateView.selected;
            } else {
                dateView.selected = false;
            }
        });
    }

    async onApply() {
        this.selectedCategory = [];
        let flag = true;
        await _.forEach(this.dateList, (date: any) => {
            if (date.selected) {
                this.selectedDate = date;
                flag = false;
            }
        });
        if (flag) {
            this.selectedDate = null;
        }
        _.forEach(this.categoryList, (category: any) => {
            if (category.selected) {
                this.selectedCategory.push(category);
            }
        });
        this.modalService.dismissAll();
        const data: any = {};
        data.dateValue = this.selectedDate;
        data.categoryValue = this.selectedCategory;
        this.filterService.changeFilter(data);
        this.selectedCategory = [];
        this.selectedDate = null;
    }
}
