// clock-timer.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-clock-timer',
  standalone: true,
  imports: [CommonModule, MatRippleModule, MatCardModule],
  template: `
    <div class="pulsing-timer-container">
      <div class="pulse-container">
        <div
          class="pulse-ripple"
          matRipple
          [matRippleColor]="rippleColor"
          [matRippleRadius]="rippleRadius"
          [matRippleCentered]="true"
          [matRippleUnbounded]="true"
          [matRippleAnimation]="rippleAnimation"
        ></div>
        <div class="pulse-inner" [class.active]="isActive">
          <div class="timer-text">{{ this.timeRemaining }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .pulsing-timer-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }

      .timer-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px;
        border-radius: 16px;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .pulse-container {
        position: relative;
        width: 120px;
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .pulse-ripple {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      .pulse-inner {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--mat-primary-color, #3f51b5);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.3s ease-out, opacity 0.3s ease-out;
        z-index: 1;
      }

      .pulse-inner.active {
        animation: breath-animation 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes breath-animation {
        0%,
        100% {
          transform: scale(0.9);
          opacity: 0.9;
        }
        50% {
          transform: scale(1.05);
          opacity: 1;
        }
      }

      .timer-text {
        font-size: 1.75rem;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.9);
        font-family: 'Roboto', sans-serif;
        text-align: center;
      }
    `,
  ],
})
export class ClockTimerComponent {
  @Input() timeRemaining: number = 0;
  @Input() isActive: boolean = false;

  rippleColor = 'rgba(var(--mat-primary-rgb), 0.1)';
  rippleRadius = 150;

  rippleAnimation = {
    enterDuration: 2000,
    exitDuration: 2000,
  };
}
