import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FeedbackService {
    private default!: boolean;

    private feedbackType = new BehaviorSubject<boolean>(this.default);
    feedback = this.feedbackType.asObservable();

    changeFeedbackType(data: boolean) {
        this.feedbackType.next(data);
    }
}
