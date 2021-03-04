import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketioService } from 'src/app/services/socketio.service';
import { AppState } from 'src/app/state/app-state';

@Component({
  selector: 'round-form',
  templateUrl: './round-form.component.html',
  styleUrls: ['./round-form.component.css']
})
export class RoundFormComponent implements OnInit, OnDestroy{
  @Select(AppState.getEventStopRound) stopRound$: Observable<boolean>;

  @Input() categories: string[];
  @Input() set lettterInPlay(value: string) {
    if (value) {
      this.letter = value;
      this.initForm();
    }
  }

  private sub = new Subject();

  public letter: string;
  public roundInProgress: boolean;
  public answersSubmitted: boolean;
  public answerForm: FormGroup;
  control0: FormControl;
  control1: FormControl;
  control2: FormControl;
  control3: FormControl;
  control4: FormControl;
  control5: FormControl;
  control6: FormControl;
  control7: FormControl;
  control8: FormControl;
  control9: FormControl;

  readonly MAX_CATEGORY = 6;
  constructor(
    private formBuilder: FormBuilder,
    private socketioService: SocketioService,
  ) {
  }

  ngOnInit(): void {
    this.stopRound$.pipe(takeUntil(this.sub)).subscribe((check) => {
      if (check) {
        this.endRound();
      }
    });
  }

  private initForm() {
    this.answerForm = new FormGroup({});
    for (let i = 0; i < this.categories.length; i++) {
      this['control' + i] = new FormControl('', [Validators.required]);
      this.answerForm.addControl(this.categories[i], this['control' + i]);
    }
    this.roundInProgress = true;
    this.answersSubmitted = false;
  }

  endRound() {
    if (!this.answersSubmitted) {
      this.answersSubmitted = true;
      this.socketioService.sendResults(this.answerForm.value, this.letter);
      this.roundInProgress = false;
    }
  }

  onSubmit() {
    console.log('onSubmit answers, ', this.answerForm.value);
    this.socketioService.endRound(this.answerForm.value, this.letter);
    this.roundInProgress = false;
    this.answersSubmitted = true;
  }

  public ngOnDestroy(): void {
    this.sub.next();
    this.sub.complete();
  }
}
