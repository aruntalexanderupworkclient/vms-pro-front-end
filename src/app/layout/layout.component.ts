import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  sidebarMode: 'expanded' | 'collapsed' | 'hidden' = 'expanded';

  ngOnInit(): void {
    this.updateSidebarForScreenSize();
    const saved = localStorage.getItem('vms_sidebar_mode');
    if (saved && window.innerWidth > 1024) {
      this.sidebarMode = saved as any;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSidebarForScreenSize();
  }

  toggleSidebar(): void {
    if (this.sidebarMode === 'expanded') {
      this.sidebarMode = 'collapsed';
    } else if (this.sidebarMode === 'collapsed') {
      this.sidebarMode = 'hidden';
    } else {
      this.sidebarMode = 'expanded';
    }
    localStorage.setItem('vms_sidebar_mode', this.sidebarMode);
  }

  onSidebarModeChange(mode: 'expanded' | 'collapsed' | 'hidden'): void {
    this.sidebarMode = mode;
  }

  get contentMargin(): string {
    if (this.sidebarMode === 'expanded') return '240px';
    if (this.sidebarMode === 'collapsed') return '64px';
    return '0';
  }

  private updateSidebarForScreenSize(): void {
    const width = window.innerWidth;
    if (width < 768) {
      this.sidebarMode = 'hidden';
    } else if (width <= 1024) {
      this.sidebarMode = 'collapsed';
    } else {
      this.sidebarMode = 'expanded';
    }
  }
}
