import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[ecSchoolYear]',
  standalone: true
})
export class SchoolYearDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('blur', ['$event.target'])
  onBlur(target: HTMLInputElement) {
    const value = target.value;
    target.value = this.formatSchoolYear(value);
  }

  private formatSchoolYear(value: string): string {
    const inputYear = parseInt(value, 10);
    const nextYear = inputYear + 1;
    const formattedYear = `${inputYear}-${nextYear}`;
    return isNaN(inputYear) ? '' : formattedYear;
  }

}
