import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSpecificComponent } from './user-specific.component';

describe('UserSpecificComponent', () => {
  let component: UserSpecificComponent;
  let fixture: ComponentFixture<UserSpecificComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSpecificComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSpecificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
