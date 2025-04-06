import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from "@angular/material/slider";
import { MatIconModule } from "@angular/material/icon";
import { PhaseCarouselComponent } from "../phase-carousel/phase-carousel.component";
import { BreathingPattern } from "../../interfaces/BreathingPattern";

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
  ],
  templateUrl: "./breathing-app.component.html",
  styleUrls: ["./breathing-app.component.scss"],
})
export class BreathingAppComponent implements OnInit, OnDestroy {
  patterns: BreathingPattern[] = [
    {
      name: "Box Breathing",
      phases: [
        { name: "Inhale", baseDuration: 4, currentDuration: 4 },
        { name: "Hold", baseDuration: 4, currentDuration: 4 },
        { name: "Exhale", baseDuration: 4, currentDuration: 4 },
        { name: "Hold", baseDuration: 4, currentDuration: 4 },
      ],
    },
    {
      name: "4-7-8 Breathing",
      phases: [
        { name: "Inhale", baseDuration: 4, currentDuration: 4 },
        { name: "Hold", baseDuration: 7, currentDuration: 7 },
        { name: "Exhale", baseDuration: 8, currentDuration: 8 },
      ],
    },
    {
      name: "Deep Breathing",
      phases: [
        { name: "Inhale", baseDuration: 5, currentDuration: 5 },
        { name: "Exhale", baseDuration: 5, currentDuration: 5 },
      ],
    },
  ];

  selectedPattern: BreathingPattern = this.patterns[0];
  currentPhaseIndex = 0;
  timeRemaining = 0;
  timeElapsed = 0;
  isActive = false;
  private timer: any;
  totalTimeForPhase: number = this.patterns[0].phases[0].currentDuration;
  phaseAdjustment = 0;

  updateSpeed(event: any) {
    // In newer Angular Material, the value comes from event.target.value
    this.phaseAdjustment = parseInt(event.target.value);
    this.updatePhaseDurations();
    this.resetTimer();
  }

  private updatePhaseDurations() {
    this.patterns.forEach((pattern) => {
      pattern.phases.forEach((phase) => {
        phase.currentDuration = Math.max(
          1,
          phase.baseDuration + this.phaseAdjustment
        );
      });
    });
  }

  resetSpeed(event: Event) {
    event.preventDefault();
    this.phaseAdjustment = 0;
    this.updatePhaseDurations();
    this.resetTimer();
  }

  ngOnInit() {
    this.updatePhaseDurations();
    this.resetTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  selectPattern(pattern: BreathingPattern) {
    this.selectedPattern = pattern;
    this.resetTimer();
  }

  startTimer() {
    if (!this.isActive) {
      this.isActive = true;
      // Start counting from 1
      this.timeElapsed = 1;
      this.timer = setInterval(() => {
        if (this.timeElapsed < this.totalTimeForPhase) {
          this.timeElapsed += 1;
        } else {
          this.nextPhase();
        }
      }, 1000);
    }
  }

  stopTimer() {
    this.isActive = false;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.resetTimer();
  }

  resetTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.isActive = false;
    this.currentPhaseIndex = 0;
    this.timeRemaining = this.selectedPattern.phases[0].currentDuration;
    this.totalTimeForPhase = this.timeRemaining;
    this.timeElapsed = 0;
  }

  private nextPhase() {
    this.currentPhaseIndex =
      (this.currentPhaseIndex + 1) % this.selectedPattern.phases.length;
    this.timeElapsed = 1;
    this.totalTimeForPhase =
      this.selectedPattern.phases[this.currentPhaseIndex].currentDuration;
  }

  get progressPercentage(): number {
    const currentPhase = this.selectedPattern.phases[this.currentPhaseIndex];
    return (
      ((currentPhase.currentDuration - this.timeRemaining) /
        currentPhase.currentDuration) *
      100
    );
  }
}
