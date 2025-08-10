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
  // setId = input.required<string>();
  cardId = input.required<string>();
  card = computed<Card>(() => this.flashcardsService.getCard(this.cardId())!)!;

  form = new FormGroup({
    newTerm: new FormControl(''),
    newDefinition: new FormControl(''),
  });

  ngOnInit(): void {
    this.form.setValue({
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

    this.flashcardsService.updateCard$.next({
      term: newTerm,
      definition: newDefinition,
      id: this.card().id,
    });

    this.onCloseBtn();
  }
}
