import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card, CardSet } from '../../../../sets-model';
import { FlashcardsService } from '../../../../flashcards/flashcards.service';

@Component({
  selector: '[app-search-suggestion]',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './search-suggestion.component.html',
  styleUrl: './search-suggestion.component.css',
})
export class SearchSuggestionComponent implements OnInit {
  flashcardsService = inject(FlashcardsService);
  set = input.required<CardSet>();
  cards!: Card[];

  ngOnInit(): void {
    this.cards = this.flashcardsService.getCards(this.set().setId);
  }

  onClick() {}
}
