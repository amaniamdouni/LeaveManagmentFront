import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { UserDialogComponent } from "./user-dialog.component";

describe("UserDialogComponent", () => {
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatIconModule,
        MatSelectModule,
        MatSnackBarModule,
      ],
      declarations: [UserDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should not add new project when name empty or filled with whitespaces)", () => {
    // given
    spyOn(component, "save");
    const button: DebugElement = fixture.debugElement.query(
      By.css("button.mat-primary")
    );

    // when
    [
      "", // empty
      " ", // space
      "	", // tab
      " 	", // space and tab
    ].forEach((value) => {

      fixture.detectChanges();

      button.nativeElement.dispatchEvent(new MouseEvent("click"));
    });

    // then
    expect(component.save).not.toHaveBeenCalled();
  });

  it("should add new user when name is filled", () => {
    // given
    spyOn(component, "save");
    const button: DebugElement = fixture.debugElement.query(
      By.css("button.mat-primary")
    );

    fixture.detectChanges();

    button.nativeElement.dispatchEvent(new MouseEvent("click"));

    // then
    expect(component.save).toHaveBeenCalled();
  });
});
