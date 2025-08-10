import { Component, Input, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'li[appCreatingCard]',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './creating-card.component.html',
  styleUrl: './creating-card.component.css',
  host: {
    class: 'creating-card',
  },
})
export class CreatingCardComponent {
  @Input({ required: true }) creatingCard!: FormGroup;

  @Input({ required: true }) cardNum!: number;

  delete = output<string>();

  onDeleteCreatingCard() {
    this.delete.emit(this.creatingCard.value.id);
  }
}
