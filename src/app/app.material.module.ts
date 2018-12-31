import { NgModule } from '@angular/core';
import {
  MatSlideToggleModule, MatTabsModule,
  MatFormFieldModule, MatToolbarModule, MatInputModule, MatButtonModule, MatMenuModule,
  MatSelectModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule,
  MatProgressBarModule, MatSnackBarModule, MatListModule, MatIconModule, MatAutocompleteModule, MatTableModule
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    MatTabsModule,
    MatTableModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatFormFieldModule,
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
    MatSnackBarModule,
    MatListModule,
    MatIconModule,
    MatDialogModule
  ],
  exports: [
    MatTabsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
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
    MatSnackBarModule,
    MatListModule,
    MatIconModule,
    MatDialogModule
  ],
})
export class AppMaterialModule { }
