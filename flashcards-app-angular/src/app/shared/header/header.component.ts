import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
