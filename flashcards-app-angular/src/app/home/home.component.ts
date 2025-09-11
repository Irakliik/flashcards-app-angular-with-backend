import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FlashcardsService } from '../flashcards/flashcards.service';
import { Card, Sets } from '../sets-model';
import { SetsMenuItemComponent } from './sets-menu-item/sets-menu-item.component';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SetsMenuItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  flashcardsService = inject(FlashcardsService);
  sets = this.flashcardsService.allSets;
  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);
  setFetched = false;

  ngOnInit(): void {
    // console.log(this.sets);
    // const subscription = this.httpClient
    //   .get<{ sets: Sets }>('http://localhost:3000/sets')
    //   .pipe(
    //     map((res) => res.sets),
    //     catchError((error) => {
    //       return throwError(
    //         () => new Error('Something went wrong fetching the available sets')
    //       );
    //     })
    //   )
    //   .subscribe({
    //     next: (sets) => {
    //       this.sets.set(sets);
    //     },
    //   });

    const subscription = this.flashcardsService.fetchSets().subscribe({
      next: () => {
        console.log(12);
        this.setFetched = true;
      },
      error: () =>
        new Error('Something went wrong fetching the available sets'),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onDelete(id: number) {
    // this.flashcardsService.deleteSet(id);
  }
}
