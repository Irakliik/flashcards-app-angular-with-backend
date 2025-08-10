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

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [BoardComponent, RouterOutlet],
  templateUrl: './flashcards.component.html',
  styleUrl: './flashcards.component.css',
})
export class FlashcardsComponent implements OnInit {
  setId = input.required<string>();
  flashcardsService = inject(FlashcardsService);

  selectedSet = computed(() =>
    this.flashcardsService.allSets().find((set) => set.setId === this.setId())
  );

  selectedCards = computed(() =>
    this.flashcardsService
      .allCards()
      .filter((set) => set.setId === this.setId())
  );
  totalCardsNum!: number;
  selectedCardNum = signal(0);

  selectedCard = computed(() => this.selectedCards()[this.selectedCardNum()]);

  isTerm = true;
  hintShown = false;

  ngOnInit(): void {
    this.totalCardsNum = this.selectedCards().length;

    this.flashcardsService.updateCard$.subscribe({
      next: (newCard) => {
        this.flashcardsService.replaceCard({
          ...newCard,
          setId: this.selectedSet()!.setId,
        });
      },
    });
  }

  onPreviousCard() {
    if (0 < this.selectedCardNum()) {
      this.selectedCardNum.update((val) => --val);
      this.isTerm = true;
      this.hintShown = false;
    }
  }

  onNextCard() {
    if (this.selectedCardNum() < this.totalCardsNum - 1) {
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
