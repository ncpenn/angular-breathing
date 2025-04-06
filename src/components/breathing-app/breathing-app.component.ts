import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from "@angular/material/slider";
import { MatIconModule } from "@angular/material/icon";
import { PhaseCarouselComponent } from "../phase-carousel/phase-carousel.component";
import { BreathingPattern } from "../../interfaces/BreathingPattern";
import { BreathingTimerService } from "../../services/breathing-timer.service";
import { BreathingPatternsService } from "../../services/breathing-pattern.service";
import { Subscription } from "rxjs";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

@Component({
  selector: "breathing-app",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSliderModule,
    MatIconModule,
    PhaseCarouselComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatButtonToggleModule,
  ],
  templateUrl: "./breathing-app.component.html",
  styleUrls: ["./breathing-app.component.scss"],
})
export class BreathingAppComponent implements OnInit, OnDestroy {
  phaseAdjustmentOptions: number[] = Array.from(
    { length: 12 },
    (_, i) => i - 2
  );
  patterns: BreathingPattern[] = [];
  selectedPattern: BreathingPattern = {} as BreathingPattern;
  currentPhaseIndex = 0;
  timeElapsed = 0;
  isActive = false;
  phaseAdjustment = 0;
  progressPercentage = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private timerService: BreathingTimerService,
    patternService: BreathingPatternsService
  ) {
    this.patterns = patternService.patterns;
    this.selectedPattern = this.patterns[0];
  }

  updateSpeed(adjustment: number) {
    this.phaseAdjustment = adjustment;
    this.timerService.updateSpeed(this.phaseAdjustment);
  }

  resetSpeed(event: Event) {
    event.preventDefault();
    this.timerService.resetSpeed();
  }

  ngOnInit() {
    this.timerService.setPattern(this.selectedPattern);
    this.subscribeToServiceObservables();
  }

  private subscribeToServiceObservables() {
    this.subscriptions.add(
      this.timerService.isActive$.subscribe((isActive) => {
        this.isActive = isActive;
      })
    );

    this.subscriptions.add(
      this.timerService.currentPhaseIndex$.subscribe((index) => {
        this.currentPhaseIndex = index;
      })
    );

    this.subscriptions.add(
      this.timerService.timeElapsed$.subscribe((time) => {
        this.timeElapsed = time;
      })
    );

    this.subscriptions.add(
      this.timerService.phaseAdjustment$.subscribe((adjustment) => {
        this.phaseAdjustment = adjustment;
      })
    );

    this.subscriptions.add(
      this.timerService.selectedPattern$.subscribe((pattern) => {
        if (pattern) {
          this.selectedPattern = pattern;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  selectPattern(pattern: BreathingPattern) {
    this.timerService.setPattern(pattern);
  }

  startTimer() {
    this.timerService.startTimer();
  }

  stopTimer() {
    this.timerService.stopTimer();
  }
}
