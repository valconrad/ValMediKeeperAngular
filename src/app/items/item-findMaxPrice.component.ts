import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Item } from './item';
import { ItemService } from './item.service';

import { GenericValidator } from '../shared/generic-validator';

@Component({
  templateUrl: './item-findMaxPrice.component.html'
})

export class FindMaxPriceComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  
    pageTitle = 'Find Max Price';
    errorMessage: string;
    findMaxPriceForm: FormGroup;
  
    item: Item;
    name = '';

    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
    
    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private itemService: ItemService) {
  
      // Defines all of the validation messages for the form.   
      this.validationMessages = {
        name: {
          required: 'Item name is required.',
          minlength: 'Item name must be at least 3 characters.',
          maxlength: 'Item name cannot exceed 50 characters.'
        }        
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      
    }
  
    ngOnInit(): void {
      this.findMaxPriceForm = this.fb.group({
        name: [
          '', 
          [Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50)]
          ]        
      }); 
    }
     
    ngAfterViewInit(): void {
      const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
  
      merge(this.findMaxPriceForm.valueChanges, ...controlBlurs).pipe(
        debounceTime(800)
      ).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.findMaxPriceForm);
      });
    }  
    
    getMaxPriceByName(name: string): void {
        this.errorMessage = "";
        if (this.findMaxPriceForm.valid) {
            if (this.findMaxPriceForm.dirty) {
              const p = { ...this.item, ...this.findMaxPriceForm.value };

              if (p.name) {
                this.itemService.getMaxPriceByName(p)
                .subscribe({
                    next: (item: number) => this.displayItem(item),
                    error: err => this.errorMessage = err
                });
              }
            } else {
                this.errorMessage = 'Please correct the validation errors.';
            }
        }
    }

    maxCost: number;

    displayItem(item: number): void {
        this.maxCost = item;       
    }  
}