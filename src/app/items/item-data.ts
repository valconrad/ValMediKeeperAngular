import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Item } from './item';

export class ItemData implements InMemoryDbService {

 createDb(): { items: Item[]} {
    const items: Item[] = [];
    // [
    //   {
    //     id: 1,
    //     name: 'ITEM 1',
    //     cost: 100.00,
    //   },
    //   {
    //     id: 2,
    //     name: 'ITEM 2',
    //     cost: 200.00,
    //   },
    //   {
    //     id: 3,
    //     name: 'ITEM 1',
    //     cost: 250.00,
    //   },
    //   {
    //     id: 4,
    //     name: 'ITEM 3',
    //     cost: 300.00,
    //   },
    //   {
    //     id: 5,
    //     name: 'ITEM 4',
    //     cost: 50.00,
    //   },
    //   {
    //     id: 6,
    //     name: 'ITEM 4',
    //     cost: 40.00,
    //   },
    //   {
    //     id: 7,
    //     name: 'ITEM 2',
    //     cost: 200.00,
    //   }   
      
    // ]; 
    return { items };
  }
}