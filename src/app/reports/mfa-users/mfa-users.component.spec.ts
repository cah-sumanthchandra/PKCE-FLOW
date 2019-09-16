import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaUsersComponent } from './mfa-users.component';

describe('MfaUsersComponent', () => {
  let component: MfaUsersComponent;
  let fixture: ComponentFixture<MfaUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfaUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
