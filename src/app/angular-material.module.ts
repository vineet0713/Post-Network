import { NgModule } from '@angular/core';

import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
} from '@angular/material';

@NgModule({
	// imports: [
	// 	MatInputModule,
	// 	MatCardModule,
	// 	MatButtonModule,
	// 	MatToolbarModule,
	// 	MatExpansionModule,
	// 	MatProgressSpinnerModule,
	// 	MatPaginatorModule,
	// ],
	exports: [			// By just having these exports, Angular will automatically do the importing!
		MatInputModule,
		MatCardModule,
		MatButtonModule,
		MatToolbarModule,
		MatExpansionModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
	],
})
export class AngularMaterialModule { }