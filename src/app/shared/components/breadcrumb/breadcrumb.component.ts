import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumbs();
    });
    this.breadcrumbs = this.buildBreadcrumbs();
  }

  private buildBreadcrumbs(): Breadcrumb[] {
    const url = this.router.url.split('?')[0];
    const segments = url.split('/').filter(s => s);
    const crumbs: Breadcrumb[] = [{ label: 'Home', url: '/dashboard' }];
    let path = '';
    for (const seg of segments) {
      path += '/' + seg;
      const label = seg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      crumbs.push({ label, url: path });
    }
    return crumbs;
  }
}
