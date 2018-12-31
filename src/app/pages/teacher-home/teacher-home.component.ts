import { Component, OnInit, Input } from '@angular/core';
import { Sort } from '@angular/material';
import { Profile, School, Point, Student } from '../../shared/models';
import { RewardService } from '../../shared/services';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { AppConfig } from '../../app.config';

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

  constructor(
    public translateService: TranslateService,
    public rewardService: RewardService
  ) { }

  ngOnInit() {
    this.getStudentWithRewards();
  }

  // filter:  ?filter=%7B%22include%22%3A%5B%22rewards%22%2C%22avatar%22%5D%7D

  getStudentWithRewards() {
    this.rewardService.getAllStudentsWithRewards().subscribe(
      response => {
        this.studentsWithRewards = this.parseObjects(response);
        this.sortedData = this.studentsWithRewards;
      }
    );
  }

  parseObjects(students: Student[]): Student[] {
    const points_array = this.allPoints;
    Object.keys(students).forEach(
      function (index) {
        students[index]['points'] = JSON.parse(students[index].rewards.points_obj);
        Object.keys(points_array).forEach(
          function (index_2) {
            if (students[index]['points'][points_array[index_2].id] === undefined) {
              students[index]['points'][points_array[index_2].id] = 0;
            }

            students[index]['points'][points_array[index_2].id] =
              students[index]['points'][points_array[index_2].id] * points_array[index_2].value;
            if (students[index]['points'][points_array[index_2].id] === -0) {
              students[index]['points'][points_array[index_2].id] = 0;
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
            a['points'][points_array[index].id],
            b['points'][points_array[index].id],
            isAsc
          );
        }
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

