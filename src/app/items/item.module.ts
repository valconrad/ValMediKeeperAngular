import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';



import { ItemListComponent } from './item-list.component';
import { ItemDetailComponent } from './item-detail.component';
import { ItemEditComponent } from './item-edit.component';
import { ItemEditGuard } from './item-edit.guard';
import { FindMaxPriceComponent } from './item-findMaxPrice.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'items', component: ItemListComponent },
      { path: 'items/:id', component: ItemDetailComponent },
      {
        path: 'items/:id/edit',
        canDeactivate: [ItemEditGuard],
        component: ItemEditComponent
      },
      { path: 'findmaxprice', component: FindMaxPriceComponent },
    ])
  ],
  declarations: [
    ItemListComponent,
    ItemDetailComponent,
    ItemEditComponent,
    FindMaxPriceComponent
  ]
})
export class ItemModule { }
