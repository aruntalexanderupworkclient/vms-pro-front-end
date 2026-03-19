import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-photo-capture',
  template: `
    <div class="photo-capture">
      <div class="camera-preview">
        <span class="material-icons">videocam</span>
        <p>Camera Preview</p>
      </div>
      <button class="btn btn-primary" (click)="capture()">
        <span class="material-icons">camera_alt</span>
        Capture
      </button>
    </div>
  `,
  styles: [`
    .photo-capture { text-align: center; }
    .camera-preview {
      width: 100%;
      height: 240px;
      background: #1F2937;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #9CA3AF;
      margin-bottom: 16px;
    }
    .camera-preview .material-icons { font-size: 48px; margin-bottom: 8px; }
  `]
})
export class PhotoCaptureComponent {
  @Output() photoCaptured = new EventEmitter<string>();

  capture(): void {
    // Placeholder — would use getUserMedia in production
    this.photoCaptured.emit('data:image/png;base64,placeholder');
  }
}
