import { Component, OnInit, Input } from '@angular/core';
import { Reward } from '../../shared/models/reward';
import { Rango, Point, Profile, School } from '../../shared/models';

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

  constructor() { }

  ngOnInit() {
  }

}
