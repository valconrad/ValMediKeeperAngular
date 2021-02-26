import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Item } from './item';
import { ItemService } from './item.service';

import { GenericValidator } from '../shared/generic-validator';



@Component({
  templateUrl: './item-edit.component.html'
})
export class ItemEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Item Edit';
  errorMessage: string;
  itemForm: FormGroup;

  item: Item;
  private sub: Subscription;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  
  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private itemService: ItemService) {
 
    this.validationMessages = {
      name: {
        required: 'Item name is required.',
        minlength: 'Item name must be at least 3 characters.',
        maxlength: 'Item name cannot exceed 50 characters.'
      },
      cost: {
        required: 'Item cost is required.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    
  }

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      name: [
        '', 
        [Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)]
        ],
      cost: ['', Validators.required]      
    });

    // Read the Item Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getItem(id);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {

    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.itemForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.itemForm);
    });
  }

  getItem(id: number): void {
    this.itemService.getItem(id)
      .subscribe({
        next: (item: Item) => this.displayItem(item),
        error: err => this.errorMessage = err
      });
  }

  displayItem(item: Item): void {
    if (this.itemForm) {
      this.itemForm.reset();
    }
    this.item = item;

    if (this.item.id === 0) {
      this.pageTitle = 'Add Item';
    } else {
      this.pageTitle = `Edit Item: ${this.item.name}`;
    }

    this.itemForm.patchValue({
      name: this.item.name,
      cost: this.item.cost
    });
    
  }

  deleteItem(): void {
    if (this.item.id === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the item: ${this.item.name}?`)) {
        this.itemService.deleteItem(this.item.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  saveItem(): void {
    if (this.itemForm.valid) {
      if (this.itemForm.dirty) {
        const p = { ...this.item, ...this.itemForm.value };

        if (p.id === 0) {
          this.itemService.createItem(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.itemService.updateItem(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.itemForm.reset();
    this.router.navigate(['/items']);
  }
}