import { Component, OnInit, Input } from '@angular/core';
import { Profile, School } from '../../shared/models';

@Component({
  selector: 'app-teacher-home',
  templateUrl: './teacher-home.component.html',
  styleUrls: ['./teacher-home.component.scss']
})
export class TeacherHomeComponent implements OnInit {

  @Input() profile: Profile;
  @Input() school: School;

  constructor() { }

  ngOnInit() {
  }

}
