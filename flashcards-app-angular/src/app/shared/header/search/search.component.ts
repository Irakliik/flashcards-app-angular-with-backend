import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SearchSuggestionComponent } from './search-suggestion/search-suggestion.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FlashcardsService } from '../../../flashcards/flashcards.service';
import { CardSet } from '../../../sets-model';
import { RouterLink } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchSuggestionComponent, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  flashcardsService = inject(FlashcardsService);
  searchQuery = signal('');
  focused = false;

  searchSuggestion = computed(() =>
    this.flashcardsService.allSets().reduce((acc, set) => {
      if (!this.searchQuery()) return [];
      return set.title.toLowerCase().includes(this.searchQuery())
        ? [...acc, set]
        : acc;
    }, [] as CardSet[])
  );

  onBlur() {
    setTimeout(() => {
      this.focused = false;
    }, 300);
  }
}
