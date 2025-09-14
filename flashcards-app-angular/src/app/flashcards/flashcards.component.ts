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
  rotate = signal<'none' | 'front' | 'back'>('none');

  // selectedSet = signal<CardSet>({
  //   title: '',
  //   description: '',
  //   setId: 0,
  //   numCards: 0,
  // });
  selectedSet = computed(() =>
    this.flashcardsService.allSets().find((set) => set.setId === +this.setId())
  );

  // selectedCards = signal<Card[]>([]);
  selectedCards = computed(() => this.flashcardsService.allCardsOfSet());

  totalCardsNum = signal(0);
  selectedCardNum = signal(0);

  selectedCard = computed(() => this.selectedCards()[this.selectedCardNum()]);

  isTerm = true;
  hintShown = false;

  ngOnInit(): void {
    this.flashcardsService.fetchCards(this.setId()).subscribe({
      next: () => {
        this.totalCardsNum.set(this.selectedCards().length);
      },
    });
  }

  onPreviousCard() {
    if (0 < this.selectedCardNum()) {
      this.selectedCardNum.update((val) => --val);
      this.isTerm = true;
      this.hintShown = false;
      if (this.rotate() === 'back') this.rotate.set('front');
    }
  }

  onNextCard() {
    if (this.selectedCardNum() < this.totalCardsNum() - 1) {
      this.selectedCardNum.update((val) => ++val);
      this.isTerm = true;
      this.hintShown = false;
      if (this.rotate() === 'back') this.rotate.set('front');
    }
  }

  onSwapBtn() {
    this.flashcardsService.swapCards();
    this.isTerm = true;
    this.hintShown = false;
  }

  onShuffle() {
    this.flashcardsService.shuffleCards();
  }
}
