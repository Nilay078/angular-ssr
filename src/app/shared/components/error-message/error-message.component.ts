import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Pattern } from '../../../constant/pattern';

@Component({
    selector: 'app-error-message',
    templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent implements OnInit, OnChanges {
    @Input() errors: any;
    errorMessage?: string;

    ngOnInit(): void {
        this.ngOnChanges();
    }

    ngOnChanges() {
        if (this.errors?.required) {
            this.errorMessage = 'This field is required and cannot be left blank.';
        }
        if (this.errors?.minlength) {
            this.errorMessage = 'Please enter at least ' + this.errors.minlength.requiredLength + ' characters.';
        }
        if (this.errors?.maxlength) {
            this.errorMessage = 'You have reached maximum limit of ' + this.errors.maxlength.requiredLength + ' allowed characters.';
        }
        if (this.errors?.confirmPasswordValidator) {
            this.errorMessage = 'Password do not match. Please re-type your password.';
        }
        if (this.errors?.pattern) {
            switch (this.errors.pattern.requiredPattern) {
                case String(Pattern.email.pattern):
                    this.errorMessage = Pattern.email.message;
                    break;
                case String(Pattern.mobile.pattern):
                    this.errorMessage = Pattern.mobile.message;
                    break;
                case String(Pattern.alphaNumeric.pattern):
                    this.errorMessage = Pattern.alphaNumeric.message;
                    break;
                case String(Pattern.alphaWithSpace.pattern):
                    this.errorMessage = Pattern.alphaWithSpace.message;
                    break;
                case String(Pattern.alphaWithSpaceDot.pattern):
                    this.errorMessage = Pattern.alphaWithSpaceDot.message;
                    break;
                case String(Pattern.onlyAlpha.pattern):
                    this.errorMessage = Pattern.onlyAlpha.message;
                    break;
                case String(Pattern.onlyNumeric.pattern):
                    this.errorMessage = Pattern.onlyNumeric.message;
                    break;
            }
        }
    }
}
