import {
  Component,
  computed,
  inject,
  input,
  model,
  OnInit,
  output,
} from '@angular/core';
import { Card } from '../../../sets-model';
import { FlashcardsService } from '../../flashcards.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-card',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-card.component.html',
  styleUrl: './edit-card.component.css',
})
export class EditCardComponent implements OnInit {
  private flashcardsService = inject(FlashcardsService);
  closeModal = output();
  termFocused = false;
  definitionFocused = false;
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  setId = input.required<string>();
  cardId = input.required<string>();
  card = computed<Card>(() => this.flashcardsService.getCard(+this.cardId())!)!;

  form = new FormGroup({
    newTerm: new FormControl(''),
    newDefinition: new FormControl(''),
  });

  ngOnInit(): void {
    console.log(this.cardId());

    console.log(this.card());
    this.form.patchValue({
      newTerm: this.card().term,
      newDefinition: this.card().definition,
    });
  }

  onCloseBtn() {
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
  }

  onSubmit(e: Event) {
    e.preventDefault();
    const newTerm = this.form.value.newTerm!;
    const newDefinition = this.form.value.newDefinition!;
    // this.flashcardsService.updateCard$.next({
    //   term: newTerm,
    //   definition: newDefinition,
    //   id: this.card().id,
    // });

    const updatedCard: Card = {
      term: newTerm,
      definition: newDefinition,
      id: +this.cardId(),
      setId: +this.setId(),
    };

    this.flashcardsService.updateCard(updatedCard).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
    });
    this.onCloseBtn();
  }
}
