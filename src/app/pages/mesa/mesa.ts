import {Component, OnInit} from '@angular/core';

import { MatSelectChange, MatSnackBar } from '@angular/material';

import {Mesa} from '../../shared/models/mesa';
import {TranslateService} from 'ng2-translate';
import {Group, Login, Role} from '../../shared/models';
import {AlertService, GroupService, LoadingService, UtilsService} from '../../shared/services';
import {AppConfig} from '../../app.config';
import {MesaService} from '../../shared/services/mesa.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.html',
  styleUrls: ['./mesa.scss']
})
export class MesaComponent implements OnInit {
  public mesas: Mesa;
  public myRole: Role;
  public role = Role;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public mesaServices: MesaService,
    public loadingService: LoadingService,
    public snackbar: MatSnackBar) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    this.myRole = this.utilsService.role;
  }

  ngOnInit(): void {
    if (this.myRole === Role.STUDENT) {
      this.loadingService.show();
      this.mesaServices.getMyMesa().subscribe(
        ((mesa: Mesa) => {
          this.loadingService.hide();
          this.mesas = mesa;
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }

}
