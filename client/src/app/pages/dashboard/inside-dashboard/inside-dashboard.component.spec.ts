import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsideDashboardComponent } from './inside-dashboard.component';

describe('InsideDashboardComponent', () => {
  let component: InsideDashboardComponent;
  let fixture: ComponentFixture<InsideDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsideDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsideDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
