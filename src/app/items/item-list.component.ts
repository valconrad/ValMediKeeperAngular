import { Component, OnInit } from '@angular/core';

import { Item } from './item';
import { ItemService } from './item.service';

@Component({
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  pageTitle = 'List of Items';
  errorMessage = '';
  maxPriceOnly = false;
  items: Item[] = [];

  constructor(private itemService: ItemService) { }

  toggleMaxOnly():void{
    this.maxPriceOnly = !this.maxPriceOnly;
  }

  refreshItems(): void{  
      this.toggleMaxOnly();
      this.itemService.getItems(this.maxPriceOnly).subscribe({
        next: items => {
          this.items = items;
        },
        error: err => this.errorMessage = err
      });
  }
   
  ngOnInit(): void {
    this.itemService.getItems(this.maxPriceOnly).subscribe({
      next: items => {
        this.items = items;        
      },
      error: err => this.errorMessage = err
    });
  }
}