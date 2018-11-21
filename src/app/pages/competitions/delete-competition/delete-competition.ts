import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoadingService, AlertService, CompetitionService } from '../../../shared/services/index';

import { AppConfig } from '../../../app.config';
import { Competition, Journey, Match } from '../../../shared/models/index';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-delete-competition',
  templateUrl: './delete-competition.html',
  styleUrls: ['./delete-competition.scss']
})
export class DeleteCompetitionComponent implements OnInit {

  public competition: Competition;
  public journeys: Journey[];

  constructor(
    public alertService: AlertService,
    public loadingService: LoadingService,
    public competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogRef: MatDialogRef<DeleteCompetitionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.competition = this.data.competition;
    this.journeys = this.data.journeys;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  delete(): void {
    this.loadingService.show();
    this.deleteParticipants();
  }

  deleteParticipants() {
    this.competitionService.deleteParticipantsCompetition(this.competition)
    .subscribe( (response => {
      this.deleteMatches();
    }),
    ((error: Response) => {
      this.loadingService.hide();
      this.alertService.show(error.toString());
    }));
  }

  deleteMatches() {
    let journeysDeleted = 0;
    for (let _j = 0; _j < this.journeys.length; _j++) {
      this.competitionService.deleteMatchesCompetition(+this.journeys[_j].id)
      .subscribe( (response => {
        journeysDeleted = journeysDeleted + 1;
        if (journeysDeleted === this.journeys.length) {
          this.deleteJourneys();
        }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    }

  }

  deleteJourneys() {
    this.competitionService.deleteJourneysCompetition(+this.competition.id)
    .subscribe( (response => {
      this.deleteCompetition();
    }),
    ((error: Response) => {
      this.loadingService.hide();
      this.alertService.show(error.toString());
    }));
  }

  deleteCompetition() {
    this.competitionService.deleteCompetition(+this.competition.id)
    .subscribe( (response => {
      this.loadingService.hide();
      this.alertService.show('La competición ha sido eliminada');
      this.dialogRef.close();
      this.router.navigate(['/competitions']);
    }),
    ((error: Response) => {
      this.loadingService.hide();
      this.alertService.show(error.toString());
    }));
  }

}
