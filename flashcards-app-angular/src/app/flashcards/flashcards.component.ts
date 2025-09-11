import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FlashcardsService } from './flashcards.service';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Card, CardSet, Sets } from '../sets-model';

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [BoardComponent, RouterOutlet],
  templateUrl: './flashcards.component.html',
  styleUrl: './flashcards.component.css',
})
export class FlashcardsComponent implements OnInit {
  setId = input.required<number>();
  httpClient = inject(HttpClient);
  flashcardsService = inject(FlashcardsService);

  selectedSet = signal<CardSet>({
    title: '',
    description: '',
    setId: 0,
    numCards: 0,
  });

  selectedCards = signal<Card[]>([]);
  totalCardsNum = signal(0);
  selectedCardNum = signal(0);

  selectedCard = computed(() => this.selectedCards()![this.selectedCardNum()]);

  isTerm = true;
  hintShown = false;

  ngOnInit(): void {
    this.flashcardsService.fetchSets().subscribe({
      next: (sets) => {
        // console.log(sets.find((set) => set.setId === this.setId()));
        // this.selectedSet.set(sets.find((set) => set.setId == this.setId())!);
      },
    });

    this.flashcardsService.fetchCards(this.setId()).subscribe({
      next: (cards) => {
        this.selectedCards.set(cards);
        this.totalCardsNum.set(cards.length);
      },
    });

    // this.flashcardsService.updateCard$.subscribe({
    //   next: (newCard) => {
    //     this.flashcardsService.replaceCard({
    //       ...newCard,
    //       setId: this.selectedSet()!.setId,
    //     });
    //   },
    // });
  }

  onPreviousCard() {
    if (0 < this.selectedCardNum()) {
      this.selectedCardNum.update((val) => --val);
      this.isTerm = true;
      this.hintShown = false;
    }
  }

  onNextCard() {
    if (this.selectedCardNum() < this.totalCardsNum() - 1) {
      this.selectedCardNum.update((val) => ++val);
      this.isTerm = true;
      this.hintShown = false;
    }
  }

  onSwapBtn() {
    this.flashcardsService.swapCards(this.selectedSet()!.setId);
    this.isTerm = true;
    this.hintShown = false;
  }

  onShuffle() {
    this.flashcardsService.shuffleCards(this.setId());
  }
}
