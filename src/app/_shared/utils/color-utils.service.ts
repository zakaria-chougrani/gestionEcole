import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorUtilsService {

  getBoxColor(): any {
    const randomColor = this.getRandomColor();
    const textColor = this.getContrastingTextColor(randomColor);
    return {
      'background-color': randomColor,
      'color': textColor
    };
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getContrastingTextColor(color: string): string {
    const hexColor = color.substring(1);
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
}
