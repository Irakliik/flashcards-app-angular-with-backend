import { Component, inject, input, OnInit, output } from '@angular/core';
import { FlashcardsService } from '../../flashcards/flashcards.service';
import { Card, CardSet, Sets } from '../../sets-model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sets-menu-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sets-menu-item.component.html',
  styleUrl: './sets-menu-item.component.css',
})
export class SetsMenuItemComponent implements OnInit {
  delete = output<string>();
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  flashcardsService = inject(FlashcardsService);

  cardSet = input.required<CardSet>();

  cards!: Card[];

  ngOnInit(): void {
    this.cards = this.flashcardsService.getCards(this.cardSet().setId);
  }
  onDeleteBtn(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.delete.emit(this.cardSet().setId);
  }

  onEditBtn(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['create-set'], {
      queryParams: {
        edit: this.cardSet().setId,
      },
    });
  }
}
