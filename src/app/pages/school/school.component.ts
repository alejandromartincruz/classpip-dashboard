import { Component, OnInit, Input } from '@angular/core';
import { School } from '../../shared/models';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit {

  @Input() school: School;
  public backgroundImg: SafeStyle;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.backgroundImg = this.getStyle(this.school.imageBig);
  }

  private getStyle(url: string) {

    const profilePicUrl = url;
    const style = `linear-gradient(
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5)
      ),
      url(${profilePicUrl})`;

    // sanitize the style expression
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}
