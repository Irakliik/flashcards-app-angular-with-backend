import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CreateSetService {
  extractedCards$ = new Subject<{ term: string; definition: string }[]>();
}
