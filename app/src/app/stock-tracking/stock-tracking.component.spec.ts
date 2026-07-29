import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTrackingComponent } from './stock-tracking.component';

describe('StockTrackingComponent', () => {
  let component: StockTrackingComponent;
  let fixture: ComponentFixture<StockTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
