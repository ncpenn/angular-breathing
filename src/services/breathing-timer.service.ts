import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { BreathingPattern } from "../interfaces/BreathingPattern";

@Injectable({
  providedIn: "root",
})
export class BreathingTimerService {
  private _isActive = new BehaviorSubject<boolean>(false);
  private _currentPhaseIndex = new BehaviorSubject<number>(0);
  private _timeElapsed = new BehaviorSubject<number>(0);
  private _phaseAdjustment = new BehaviorSubject<number>(0);
  private _selectedPattern = new BehaviorSubject<BreathingPattern | null>(null);
  private _phaseComplete = new Subject<void>();

  private timer: any;
  private totalTimeForPhase: number = 0;

  // Observables that components can subscribe to
  public isActive$ = this._isActive.asObservable();
  public currentPhaseIndex$ = this._currentPhaseIndex.asObservable();
  public timeElapsed$ = this._timeElapsed.asObservable();
  public phaseAdjustment$ = this._phaseAdjustment.asObservable();
  public selectedPattern$ = this._selectedPattern.asObservable();
  public phaseComplete$ = this._phaseComplete.asObservable();

  // Computed observables
  get progressPercentage$(): Observable<number> {
    return this.selectedPattern$.pipe(
      switchMap(() => this.timeElapsed$),
      map(() => this.calculateProgressPercentage())
    );
  }

  constructor() {}

  setPattern(pattern: BreathingPattern): void {
    // Create a deep copy of the pattern
    const patternCopy = JSON.parse(JSON.stringify(pattern));

    // Apply the current phase adjustment to the new pattern
    const adjustment = this._phaseAdjustment.getValue();
    patternCopy.phases.forEach(
      (phase: {
        name: string;
        baseDuration: number;
        currentDuration: number;
      }) => {
        phase.currentDuration = Math.max(1, phase.baseDuration + adjustment);
      }
    );

    this._selectedPattern.next(patternCopy);
    this.resetTimer();
  }

  updateSpeed(adjustment: number): void {
    this._phaseAdjustment.next(adjustment);
    this.updatePhaseDurations();
    this.resetTimer();
  }

  private updatePhaseDurations(): void {
    const pattern = this._selectedPattern.getValue();
    if (!pattern) return;

    const adjustment = this._phaseAdjustment.getValue();
    pattern.phases.forEach((phase) => {
      phase.currentDuration = Math.max(1, phase.baseDuration + adjustment);
    });

    // Update the selected pattern with the new durations
    this._selectedPattern.next({ ...pattern });
  }

  resetSpeed(): void {
    this._phaseAdjustment.next(0);
    this.updatePhaseDurations();
    this.resetTimer();
  }

  startTimer(): void {
    if (this._isActive.getValue()) return;

    const pattern = this._selectedPattern.getValue();
    if (!pattern) return;

    this._isActive.next(true);
    this._timeElapsed.next(1);

    this.totalTimeForPhase =
      pattern.phases[this._currentPhaseIndex.getValue()].currentDuration;

    this.timer = setInterval(() => {
      const currentElapsed = this._timeElapsed.getValue();
      if (currentElapsed < this.totalTimeForPhase) {
        this._timeElapsed.next(currentElapsed + 1);
      } else {
        this.nextPhase();
        this._phaseComplete.next();
      }
    }, 1000);
  }

  stopTimer(): void {
    this._isActive.next(false);
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.resetTimer();
  }

  resetTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    const pattern = this._selectedPattern.getValue();
    if (!pattern) return;

    this._isActive.next(false);
    this._currentPhaseIndex.next(0);
    this._timeElapsed.next(0);
    this.totalTimeForPhase = pattern.phases[0].currentDuration;
  }

  private nextPhase(): void {
    const pattern = this._selectedPattern.getValue();
    if (!pattern) return;

    const nextIndex =
      (this._currentPhaseIndex.getValue() + 1) % pattern.phases.length;
    this._currentPhaseIndex.next(nextIndex);
    this._timeElapsed.next(1);
    this.totalTimeForPhase = pattern.phases[nextIndex].currentDuration;
  }

  // Helper methods that components might need
  private calculateProgressPercentage(): number {
    const pattern = this._selectedPattern.getValue();
    if (!pattern) return 0;

    const currentPhaseIndex = this._currentPhaseIndex.getValue();
    const currentPhase = pattern.phases[currentPhaseIndex];
    const timeElapsed = this._timeElapsed.getValue();

    return (timeElapsed / currentPhase.currentDuration) * 100;
  }

  // Getter methods for current values
  get isActive(): boolean {
    return this._isActive.getValue();
  }

  get currentPhaseIndex(): number {
    return this._currentPhaseIndex.getValue();
  }

  get timeElapsed(): number {
    return this._timeElapsed.getValue();
  }

  get phaseAdjustment(): number {
    return this._phaseAdjustment.getValue();
  }

  get selectedPattern(): BreathingPattern | null {
    return this._selectedPattern.getValue();
  }
}
