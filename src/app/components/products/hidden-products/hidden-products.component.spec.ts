import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenProductsComponent } from './hidden-products.component';

describe('HiddenProductsComponent', () => {
  let component: HiddenProductsComponent;
  let fixture: ComponentFixture<HiddenProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiddenProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
