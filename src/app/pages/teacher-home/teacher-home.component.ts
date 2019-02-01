import { Component, OnInit, Input } from '@angular/core';
import { Sort, PageEvent } from '@angular/material';
import { Profile, School, Point, Student } from '../../shared/models';
import { RewardService } from '../../shared/services';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'app-teacher-home',
  templateUrl: './teacher-home.component.html',
  styleUrls: ['./teacher-home.component.scss']
})
export class TeacherHomeComponent implements OnInit {

  @Input() profile: Profile;
  @Input() school: School;
  @Input() allPoints: Point;

  public studentsWithRewards: Student[];
  public sortedData: Student[];
  public objectKeys = Object.keys;

  public pageSizeInit = 10;
  public length: number;
  public pageSizeOptions = [5, 10, 25, 100];
  public pageEvent: PageEvent;

  constructor(
    public translateService: TranslateService,
    public rewardService: RewardService
  ) { }

  ngOnInit() {
    this.getStudentWithRewards();
  }

  getStudentWithRewards() {
    this.rewardService.getAllStudentsWithRewards(this.school.id).subscribe(
      response => {
        this.studentsWithRewards = this.parseObjects(response);
        this.sortedData = this.studentsWithRewards;
        this.length = this.sortedData.length;
        this.pageEvent = new PageEvent;
        this.pageEvent.pageIndex = 0;
        this.pageEvent.pageSize = this.pageSizeInit;
        this.pageEvent.length = this.length;
      }
    );
  }

  parseObjects(students: Student[]): Student[] {
    const points_array = this.allPoints;
    Object.keys(students).forEach(
      function (index) {
        students[index].rewards.points_obj = JSON.parse(students[index].rewards.points_obj);
        Object.keys(points_array).forEach(
          function (index_2) {
            if (students[index].rewards.points_obj[points_array[index_2].id] === undefined) {
              students[index].rewards.points_obj[points_array[index_2].id] = 0;
            }

            students[index].rewards.points_obj[points_array[index_2].id] =
              students[index].rewards.points_obj[points_array[index_2].id] * points_array[index_2].value;
            if (students[index].rewards.points_obj[points_array[index_2].id] === -0) {
              students[index].rewards.points_obj[points_array[index_2].id] = 0;
            }
          });
        students[index].rewards.badges_obj = JSON.parse(students[index].rewards.badges_obj);
      }
    );
    return students;
  }

  sortData(sort: Sort) {
    const data = this.studentsWithRewards;
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      const points_array = this.allPoints;
      if (sort.active === 'name') {
        return compare(a.name, b.name, isAsc);
      }
      if (sort.active === 'surname') {
        return compare(a.surname, b.surname, isAsc);
      }
      if (sort.active === 'points') {
        return compare(a.rewards.points, b.rewards.points, isAsc);
      }
      if (sort.active === 'level') {
        return compare(a.rewards.level, b.rewards.level, isAsc);
      }
      if (sort.active === 'rank') {
        return compare(a.rewards.rank, b.rewards.rank, isAsc);
      }

      for (const index of Object.keys(points_array)) {
        if (parseInt(points_array[index].id, 10) === parseInt(sort.active, 10)) {
          return compare(
            a.rewards.points_obj[points_array[index].id],
            b.rewards.points_obj[points_array[index].id],
            isAsc
          );
        }
      }
    });
  }

  paginationFrom(pageEvent) {
    return ((pageEvent.pageIndex === 0) ? pageEvent.pageIndex : (pageEvent.pageIndex) * pageEvent.pageSize);
  }

  paginationTo(pageEvent) {
    return this.paginationFrom(pageEvent) + pageEvent.pageSize;
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

