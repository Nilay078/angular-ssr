import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RegisterUserService {
    private default!: any;

    private register = new BehaviorSubject<any>(this.default);
    userView = this.register.asObservable();

    changeUserView(userValue: any) {
        this.register.next(userValue);
    }
}
