import { Component, computed, inject, input, OnInit } from '@angular/core';
import { CreatingCardComponent } from './creating-card/creating-card.component';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../shared/button/button.component';
import { FlashcardsService } from '../flashcards/flashcards.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Card, CardSet, NewCard } from '../sets-model';
import { CreateSetService } from './create-set.service';

@Component({
  selector: 'app-create-set',
  standalone: true,
  imports: [
    CreatingCardComponent,
    ReactiveFormsModule,
    ButtonComponent,
    RouterOutlet,
  ],
  templateUrl: './create-set.component.html',
  styleUrl: './create-set.component.css',
})
export class CreateSetComponent implements OnInit {
  flashcardsService = inject(FlashcardsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  createSetService = inject(CreateSetService);
  // For Editing [
  edit = input<string>();
  isEditing = computed(() => (this.edit() ? true : false));
  selectedSet?: CardSet;
  cards?: Card[];
  // ]
  ngOnInit(): void {
    // For Editing [
    if (this.isEditing()) {
      // this.selectedSet = this.flashcardsService.getSet(this.edit()!);
      // this.cards = this.flashcardsService.getCards(this.edit()!);

      this.form.patchValue({
        title: this.selectedSet!.title,
        description: this.selectedSet!.description,
      });

      // for (let i = 0; i < this.cards.length - 3; i++) {
      //   this.addCardGroup();
      // }

      // this.form.controls.creatingCards.controls.forEach((control, i) =>
      //   control.patchValue({
      //     term: this.cards![i].term,
      //     definition: this.cards![i].definition,
      //     id: this.cards![i].id,
      //   })
      // );
    }

    //  ]

    this.createSetService.extractedCards$.subscribe((extractedCards) => {
      const cardsArray = this.form.get('creatingCards')!.value;

      // The index of a control after which all the controls are empty
      const specialElementIndex = cardsArray.findIndex((_, i, cards) =>
        cards.slice(i).every((card) => !(card.term || card.definition))
      );

      const freeCards = cardsArray.length - specialElementIndex;

      const cardsToAddNum =
        specialElementIndex > -1
          ? extractedCards.length - freeCards
          : extractedCards.length;

      const indexToPrepopulateFrom =
        specialElementIndex > -1 ? specialElementIndex : cardsArray.length;

      for (let i = 0; i < cardsToAddNum; i++) {
        this.addCardGroup();
      }

      let indexToPopulate = indexToPrepopulateFrom;

      extractedCards.forEach((card) => {
        this.form.controls.creatingCards.controls[indexToPopulate++].patchValue(
          {
            term: card.term,
            definition: card.definition,
          }
        );
      });

      //
    });
  }

  form = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required],
    }),
    description: new FormControl(''),

    creatingCards: new FormArray([
      new FormGroup({
        term: new FormControl(''),
        definition: new FormControl(''),
        id: new FormControl(crypto.randomUUID().toString()),
      }),
      new FormGroup({
        term: new FormControl(''),
        definition: new FormControl(''),
        id: new FormControl(crypto.randomUUID().toString()),
      }),
      new FormGroup({
        term: new FormControl(''),
        definition: new FormControl(''),
        id: new FormControl(crypto.randomUUID().toString()),
      }),
    ]),
  });

  get creatingCards() {
    return this.form.controls.creatingCards.controls;
  }

  onDelete(id: string) {
    const index = this.form.controls.creatingCards.value.findIndex(
      (el) => el.id === id
    );

    (this.form.get('creatingCards') as FormArray).removeAt(index);
  }

  onAddCard() {
    this.addCardGroup();
  }

  addCardGroup() {
    this.form.controls.creatingCards.push(
      new FormGroup({
        term: new FormControl(''),
        definition: new FormControl(''),
        id: new FormControl(crypto.randomUUID().toString()),
      })
    );
  }

  onSubmit() {
    const cardsValue = this.form.get('creatingCards')!.value.map((value) => ({
      definition: value.definition,
      term: value.term,
    })) as NewCard[];

    const title = this.form.get('title')!.value as string;
    const description = this.form.get('description')!.value as string;

    const newCards = cardsValue.filter(
      (creatingCard) => creatingCard.definition && creatingCard.term
    );

    this.flashcardsService
      .addSet({ title, description, cards: newCards })
      .subscribe();

    // if (this.isEditing()) {
    //   const setId = this.selectedSet!.setId;

    //   const editedCards = newCards.map((card) => ({ ...card, setId }));

    //   this.flashcardsService.editSet(
    //     {
    //       title,
    //       description,
    //       setId,
    //     },
    //     editedCards
    //   );

    //   this.router.navigate(['']);
    //   return;
    // }

    // this.flashcardsService.addSet(
    //   {
    //     title: title,
    //     description: description,
    //   },
    //   newCards
    // );
    this.router.navigate(['']);
  }

  onSwap() {
    (this.form.get('creatingCards') as FormArray).controls.forEach((el) => {
      const term = el.get('term')!.value;
      const definition = el.get('definition')!.value;

      el.patchValue({
        term: definition,
        definition: term,
      });
    });
  }

  onImport() {
    this.router.navigate(['import'], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve',
    });
  }
}
