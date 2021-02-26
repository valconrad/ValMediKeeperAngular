import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Item } from './item';
import { ItemService } from './item.service';

@Component({
  templateUrl: './item-detail.component.html'
  
})
export class ItemDetailComponent implements OnInit {
  pageTitle = 'Item Detail';
  errorMessage = '';
  item: Item | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private itemService: ItemService) {
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getItem(id);
    }
  }

  getItem(id: number): void {
    this.itemService.getItem(id).subscribe({
      next: item => this.item = item,
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/items']);
  }

}