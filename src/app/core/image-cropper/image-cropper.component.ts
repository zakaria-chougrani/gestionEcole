import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImageCroppedEvent, ImageCropperModule} from "ngx-image-cropper";
import {MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'ec-image-cropper',
  standalone: true,
  imports: [CommonModule, ImageCropperModule, MatButtonModule],
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent {
  imageChangeEvent: any = '';
  croppedImage: any = '';
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ImageCropperComponent>
  ) {
  }
  handleImageChange(event: any): void {
    const file = event.target.files[0];
    if (file.type.match(/image\/*/) == null) {
      alert("Only images are Supported . ! ");
      return;
    }
    this.imageChangeEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  valideBtn() {
    this.dialogRef.close(this.croppedImage);
  }

  close() {
    this.dialogRef.close();
  }
}
