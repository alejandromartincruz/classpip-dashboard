import { NgModule } from '@angular/core';
import {
  MatSlideToggleModule, MatTabsModule, MatFormFieldModule,
  MatToolbarModule, MatInputModule, MatButtonModule,
  MatMenuModule, MatSelectModule, MatCardModule,
  MatGridListModule, MatProgressSpinnerModule, MatProgressBarModule,
  MatSnackBarModule, MatListModule, MatIconModule,
  MatAutocompleteModule, MatTableModule, MatSortModule,
  MatPaginatorModule
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
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule
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
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule
  ],
})
export class AppMaterialModule { }
