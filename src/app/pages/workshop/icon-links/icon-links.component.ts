import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

type Icon =
  'archive-2' |
  'external-link' |
  'external-link-2' |
  'file' |
  'file-plus' |
  'github' |
  'image' |
  'package' |
  'pdf' |
  'youtube';

@Component({
  selector: 'app-icon-links',
  templateUrl: './icon-links.component.html',
  styleUrls: ['./icon-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconLinksComponent implements OnInit {
  @Input() link = '';
  @Input() icon: Icon = 'package';

  iconSizes = {
    'archive-2': {width: 18, height: 19},
    'external-link': {width: 18, height: 18},
    'external-link-2': {width: 18, height: 18},
    'file': {width: 15, height: 19},
    'file-plus': {width: 15, height: 19},
    'github': {width: 18, height: 19},
    'image': {width: 18, height: 18},
    'package': {width: 18, height: 20},
    'pdf': {width: 20, height: 20},
    'youtube': {width: 21, height: 15},
  }

  constructor() { }

  ngOnInit() {
  }

  get linkType() {
    return this.link.match(/^http/) ? 'external' : 'internal';
  }

  get iconWidth() {
    return this.iconSizes[this.icon].width;
  }

  get iconHeight() {
    return this.iconSizes[this.icon].height;
  }

}
