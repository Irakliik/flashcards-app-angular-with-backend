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
  rotate = model<'none' | 'front' | 'back'>();

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
    if (this.rotate() === 'none' || this.rotate() === 'front') {
      this.rotate.set('back');
    } else if (this.rotate() === 'back') {
      this.rotate.set('front');
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
