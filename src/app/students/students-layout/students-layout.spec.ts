import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsLayout } from './students-layout';

describe('StudentsLayout', () => {
  let component: StudentsLayout;
  let fixture: ComponentFixture<StudentsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
