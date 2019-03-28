import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UploadComponent {
  @Input() error = '';
  @Input() file?: File;
  @Output() selectFile = new EventEmitter<File | undefined>();

  constructor() {}

  onSelectFiles(files: File[] | FileList) {
    this.file = Array.from(files)[0];
    this.selectFile.emit(this.file);
  }

  remove() {
    this.file = undefined;
    this.selectFile.emit(undefined);
  }
}