import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { StockTracking } from './stock-tracking';

@Component({
  selector: 'app-stock-tracking',
  imports: [],
  templateUrl: './stock-tracking.component.html',
  styleUrl: './stock-tracking.component.scss',
})
export class StockTrackingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('reactRoot', { static: true }) reactRoot!: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngAfterViewInit(): void {
    this.root = createRoot(this.reactRoot.nativeElement);
    this.root.render(createElement(StockTracking));
  }

  ngOnDestroy(): void {
    this.root?.unmount();
  }
}
