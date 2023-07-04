import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FonSizeUtilsService {

  getFontSize(level: string): any {
    return {
      'font-size': this.calculateFontSize(level),
      'line-height': '1.2',
    };
  }
  calculateFontSize(level: string): string {
    const boxWidth = 100; // Set the desired box width in pixels
    const textLength = level.length;
    const maxFontSize = boxWidth / textLength;
    const minFontSize = 12; // Set the minimum font size in pixels
    const adjustedFontSize = Math.max(minFontSize, maxFontSize);
    return adjustedFontSize + 'px';
  }
}
