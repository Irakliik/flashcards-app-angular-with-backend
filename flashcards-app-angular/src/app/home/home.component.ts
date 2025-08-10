import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FlashcardsService } from '../flashcards/flashcards.service';
import { Card, Sets } from '../sets-model';
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
  httpClient = inject(HttpClient);
  sets = this.flashcardsService.allSets;

  ngOnInit(): void {
    this.httpClient
      .get<{ sets: Sets }>('http://localhost:3000/sets')
      .subscribe({
        next: (sets) => {
          console.log(sets);
        },
      });
  }

  onDelete(id: string) {
    this.flashcardsService.deleteSet(id);
  }
}
