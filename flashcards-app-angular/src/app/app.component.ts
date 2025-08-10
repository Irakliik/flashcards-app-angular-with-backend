import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { SearchComponent } from './shared/header/search/search.component';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('searchTpl') searchTpl!: TemplateRef<any>;
  @ViewChild('searchTpl', { read: ViewContainerRef })
  viewContainerRef!: ViewContainerRef;
  private routerSub!: Subscription;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/') {
          this.viewContainerRef.createEmbeddedView(this.searchTpl);
        } else {
          this.viewContainerRef.clear();
        }
      });
  }
}
