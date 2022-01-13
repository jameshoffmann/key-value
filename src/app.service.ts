import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import {pairDto} from './dto'

// The way I've done it here is just one way to do it. Pro: constant time read/writes. Con: You get data loss if a user writes/deletes and the program crashes before the cron job can do its write. 
// If this store were to grow very large, the cron writes to the JSON file would become expensive. The interval would need to be increased.
//
// Another way would be to read/write directly from/to the JSON file. No chance of data loss, but the user experiences much slower read/writes, especially as the store grows.
//
// Another possible way would be to have an append only data structure to store the values
// A compaction algorithm could run through the store (cron job) and remove any duplicate keys, keeping the most recent value that was appended for that key.
// Insertions would be constant time, but reads would be O(n). In order to read, you would start at the end of the append store and 
//  run through the store backwards until you reach the desired key. Even if it is a duplicate, you would still get the most recent value for that key as long as you started from the end.
@Injectable()
export class AppService {
  private readonly store: Record<string, string> = 
    JSON.parse(fs.readFileSync('./store/store.json', 'utf-8'));

  @Cron(CronExpression.EVERY_5_SECONDS)
  updateStore(): void {
    fs.writeFileSync('./store/store.json', JSON.stringify(this.store));
  }

  storePair(key: string, value: string): void {
    this.store[key] = value;
  }

  storePairs(pairs: pairDto[]): void {
    pairs.forEach(pair => this.store[pair.key] = pair.value)
  }

  find(key: string): string {
    return this.store[key];
  }

  findAll(): string[] {
    let valueList = Object.values(this.store);
    return valueList;
  }

  deletePair(key: string): boolean {
    if (this.store.hasOwnProperty(key)) {
      delete this.store[key];
      return true
    }
    return false
  }
}