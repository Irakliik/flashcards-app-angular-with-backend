import { Component, inject, input, OnInit, output } from '@angular/core';
import { FlashcardsService } from '../../flashcards/flashcards.service';
import { Card, CardSet, Sets } from '../../sets-model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-sets-menu-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sets-menu-item.component.html',
  styleUrl: './sets-menu-item.component.css',
})
export class SetsMenuItemComponent implements OnInit {
  delete = output<number>();
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  httpClient = inject(HttpClient);
  setsLength = input<Number>();

  flashcardsService = inject(FlashcardsService);

  cardSet = input.required<CardSet>();

  ngOnInit(): void {
    // this.cards = this.flashcardsService.getCards(this.cardSet().setId);
  }
  onDeleteBtn(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    // this.delete.emit(this.cardSet().setId);
    this.flashcardsService.deleteSet(this.cardSet().setId).subscribe();
  }

  onEditBtn(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.flashcardsService.fetchCards(this.cardSet().setId).subscribe({
      next: () => {
        this.router.navigate(['create-set'], {
          queryParams: {
            edit: this.cardSet().setId,
          },
        });
      },
    });
  }
}
