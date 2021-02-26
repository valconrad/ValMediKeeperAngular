import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemsUrl = 'api/items';
  private externalItemsUrl = 'https://medikeeper.azurewebsites.net/api/items';

  private localItem : Item;

  constructor(private http: HttpClient) { }

  getItems(isGrouped: boolean): Observable<Item[]> {
    let maxonly = isGrouped ? 'true' : 'false';
    const url = `${this.externalItemsUrl}?showMaxPriceOnly=${maxonly}`;
    console.log('serviceUrl: ' + url);
    return this.http.get<Item[]>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }  

  getItem(id: number): Observable<Item> {
    if (id === 0) {
      return of(this.initializeItem());
    }
    const url = `${this.externalItemsUrl}/${id}`;
    console.log('serviceUrl: ' + url)
    return this.http.get<Item>(url)
      .pipe(
        tap(data => console.log('getItem: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getMaxPriceByName(item: Item): Observable<number> {
    let nameLocal = item.name;
    const url = `${this.externalItemsUrl}/${nameLocal}`;
    console.log('serviceUrl: ' + url)
    
    return this.http.get<number>(url)
      .pipe(
        tap(data => console.log('getItem: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createItem(item: Item): Observable<Item> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    item.id = 0;
    item.cost = +item.cost;
    
    return this.http.post<Item>(this.externalItemsUrl, item, { headers })
      .pipe(
        tap(data => console.log('createItem: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteItem(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.externalItemsUrl}/${id}`;
    return this.http.delete<Item>(url, { headers })
      .pipe(
        tap(data => console.log('deleteItem: ' + id)),
        catchError(this.handleError)
      );
  }

  updateItem(item: Item): Observable<Item> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.externalItemsUrl}/${item.id}`;

    item.cost = +item.cost;
    return this.http.put<Item>(url, item, { headers })
      .pipe(
        tap(() => console.log('updateItem: ' + item.id)),
        // Return the item on an update
        map(() => item),
        catchError(this.handleError)
      );
  }

  private handleError(err): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // Backend error
      errorMessage = `Backend returned code ${err.status}: ${err.statusText}`;
      
    }
    
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeItem(): Item {
    // Return an initialized object
    return {
      id: 0,
      name: null,      
      cost: null
    };
  }
}