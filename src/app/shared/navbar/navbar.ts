import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../services/login.service';
import { UtilsService } from '../services/utils.service';
import { UserService } from '../services/user.service';

import { Profile } from '../models/index';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavBarComponent implements OnInit {

  public isLoggedIn: boolean;

  constructor(
    private loginService: LoginService,
    public utilsService: UtilsService,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.userIsLoggedIn();
  }

  userIsLoggedIn() {
    this.loginService.isLoggedIn.subscribe(
      ((res: boolean) => {
        this.isLoggedIn = res;
      })
    );
  }
}
