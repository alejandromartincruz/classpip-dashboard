import { NgModule } from '@angular/core';
import {MatSlideToggleModule, MatTabsModule,
  MatToolbarModule, MatInputModule, MatButtonModule, MatMenuModule,
  MatSelectModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule,
  MatProgressBarModule, MatSnackBarModule, MatListModule, MatIconModule, MatAutocompleteModule,MatDatepickerModule,
  MatNativeDateModule, MatExpansionModule,
  MatRadioModule, MatStepperModule
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    MatTabsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    RouterModule,
    CommonModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTableModule,
    MatSnackBarModule,
    MatListModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatRadioModule,
    MatStepperModule
  ],
  exports: [
    MatTabsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    RouterModule,
    CommonModule,
    MatGridListModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatListModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatExpansionModule,
    MatRadioModule,
    MatStepperModule
  ],
})
export class AppMaterialModule { }
