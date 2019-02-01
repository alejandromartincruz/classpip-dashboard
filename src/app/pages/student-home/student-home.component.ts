import { Component, OnInit, Input } from '@angular/core';
import { Reward } from '../../shared/models/reward';
import { Rango, Point, Profile, School, Student } from '../../shared/models';
import { PageEvent } from '@angular/material';
import { RewardService } from '../../shared/services';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {

  @Input() profile: Profile;
  @Input() reward: Reward;
  @Input() rank: Rango;
  @Input() studentPoints: Point[];
  @Input() school: School;

  public studentsWithRewards: Student[];
  public pageSizeInit = 3;
  public length: number;
  public pageSizeOptions = [3];
  public pageEvent: PageEvent;

  constructor(
    public rewardService: RewardService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getStudentWithRewards();
  }

  getStudentWithRewards() {
    this.rewardService.getAllStudentsWithRewards(this.school.id).subscribe(
      (response: Student[]) => {
        this.studentsWithRewards = response.sort(this.comparator);
        this.length = this.studentsWithRewards.length;
        this.pageEvent = new PageEvent;
        this.pageEvent.pageIndex = 0;
        this.pageEvent.pageSize = this.pageSizeInit;
        this.pageEvent.length = this.length;
      }
    );
  }

  paginationFrom(pageEvent) {
    return ((pageEvent.pageIndex === 0) ? pageEvent.pageIndex : (pageEvent.pageIndex) * pageEvent.pageSize);
  }

  paginationTo(pageEvent) {
    return this.paginationFrom(pageEvent) + pageEvent.pageSize;
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

  comparator(a, b) {
    if (a['rewards']['points'] < b['rewards']['points']) { return 1; }
    if (a['rewards']['points'] > b['rewards']['points']) { return -1; }
    return 0;
  }

}
