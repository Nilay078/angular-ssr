import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[noSpecialCharacters]',
})
export class NoSpecialCharactersDirective {
    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent) {
        if (!event.key.match(/^[a-z\d\s]+$/i)) {
            return event.preventDefault();
        }
    }
}
