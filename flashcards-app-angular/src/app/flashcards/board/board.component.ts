import {
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { Card } from '../../sets-model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  selectedCard = input<Card>();
  isTerm = model<boolean>();
  front = signal(true);
  rotate = false;
  backVisible = false;
  frontVisible = true;
  toolsInvisible = false;
  hidden = false;

  hintShown = model.required<boolean>();

  hintBtnName = computed(() =>
    this.hintShown()
      ? this.selectedCard()!
          .definition.split(' ')
          .reduce(
            (txtCon, word) =>
              txtCon + ' ' + word[0] + '-'.repeat(word.length - 1),
            ''
          )
      : 'Get a Hint'
  );

  turnCard() {
    // this.deg.set((this.deg() + 180) % 360);
    this.rotate = !this.rotate;
    this.front.update((pos) => !pos);

    if (this.rotate) {
      this.frontVisible = false;
      this.toolsInvisible = true;
      setTimeout(() => {
        this.backVisible = true;
        this.hidden = true;
      }, 100);
    }

    if (!this.rotate) {
      this.backVisible = false;
      this.toolsInvisible = false;

      setTimeout(() => {
        this.frontVisible = true;
        this.hidden = false;
      }, 100);
    }
  }

  onEditCard(e: Event) {
    e.stopPropagation();
    this.router.navigate(['./edit', this.selectedCard()!.id], {
      relativeTo: this.activatedRoute,
    });
  }

  onHint(e: Event) {
    e.stopPropagation();
    this.hintShown.update((val) => !val);
  }
}
