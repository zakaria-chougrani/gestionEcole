import {ElementRef, Injectable} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  printPage(page:ElementRef,printFrame:ElementRef,dialogRef:MatDialogRef<any>,styleSheet?:string){
    const iframeElement = printFrame.nativeElement;
    const pageContent = page.nativeElement.innerHTML;

    if (iframeElement.contentWindow) {
      const iframeDocument = iframeElement.contentWindow.document;

      iframeDocument.open();
      iframeDocument.write(`
        <html lang="an">
          <head>
            <title>Document</title>
            ${styleSheet}
          </head>
          <body>
            ${pageContent}
          </body>
        </html>
      `);
      iframeElement.contentWindow.print();
      iframeDocument.close();
    }
    let timeOut = setTimeout(() => {
      dialogRef.close();
      clearTimeout(timeOut);
    }, 10);
  }
}
