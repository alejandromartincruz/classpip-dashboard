import { Component, OnInit, Input } from '@angular/core';
import { Profile, School } from '../../shared/models';
import { SchoolService, AlertService } from '../../shared/services';
import { PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  @Input() profile: Profile;
  public schools: School[];
  public editSchool: School;
  public pageSizeInit = 10;
  public length: number;
  public pageSizeOptions = [5, 10, 25, 100];
  public pageEvent: PageEvent;
  public dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    public schoolService: SchoolService,
    public dialog: MatDialog,
    public translateService: TranslateService,
    public alertService: AlertService
  ) { }

  ngOnInit() {
    this.adminScreen();
  }

  adminScreen() {
    this.schoolService.getSchools().subscribe(
      (schools: School[]) => {
        this.schools = schools;
        this.length = schools.length;
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

  newSchoolHandler(newSchoolGenerated) {
    this.schools.push(newSchoolGenerated);
    this.pageEvent.length += 1;
  }

  editSchoolAction(schoolId: number, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.editSchool = this.schools.filter(school => parseInt(school.id, 10) === schoolId)[0];
    document.getElementById('schoolForm').scrollIntoView();
  }

  scrollToForm() {
    this.editSchool = new School;
    document.getElementById('schoolForm').scrollIntoView();
  }

  openDeleteSchoolDialog(schoolId: number, $event) {

    $event.stopPropagation();
    $event.preventDefault();

    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });

    this.dialogRef.componentInstance.confirmMessage = this.translateService.instant('SCHOOL.CONFIRMDELETE', { schoolId });
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do confirmation actions
        this.schoolService.deleteSchool(schoolId).subscribe(response => {
          this.schools = this.schools.filter(school => parseInt(school.id, 10) !== schoolId);
          this.alertService.show(this.translateService.instant('SCHOOL.DELETED'));
        });
      }
      this.dialogRef = null;
    });
  }

}
