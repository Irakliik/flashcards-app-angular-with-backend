import {
  afterNextRender,
  Component,
  inject,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateSetService } from '../create-set.service';

@Component({
  selector: 'app-import-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './import-modal.component.html',
  styleUrl: './import-modal.component.css',
})
export class ImportModalComponent {
  isFocused = false;
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  form = viewChild.required<NgForm>('form');
  createSetService = inject(CreateSetService);

  onCancel() {
    this.router.navigate(['..'], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve',
    });
  }

  onSubmit(form: NgForm) {
    const extractedCards = form.value.import.split('\n').map((el: string) => {
      const split = el.split(' ');

      return {
        term: split[0],
        definition: split[1],
      };
    });

    this.createSetService.extractedCards$.next(extractedCards);
    this.onCancel();
  }
}
