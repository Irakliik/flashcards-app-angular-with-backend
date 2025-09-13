import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FlashcardsService } from '../flashcards/flashcards.service';
import { SetsMenuItemComponent } from './sets-menu-item/sets-menu-item.component';
import { HttpClient } from '@angular/common/http';

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
    const subscription = this.flashcardsService.fetchSets().subscribe({
      next: (res) => {
        this.setFetched = true;
      },
      error: () =>
        new Error('Something went wrong fetching the available sets'),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
