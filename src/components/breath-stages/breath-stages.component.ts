import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'breath-stages',
  standalone: true,
  imports: [CommonModule, MatRippleModule, MatCardModule],
  templateUrl: './breath-stages.component.html',
  styleUrls: ['./breath-stages.component.scss'],
})
export class BreathStagesComponent {
  @Input() timeRemaining: number = 0;
  @Input() isActive: boolean = false;

  rippleColor = 'rgba(var(--mat-primary-rgb), 0.1)';
  rippleRadius = 150;

  rippleAnimation = {
    enterDuration: 2000,
    exitDuration: 2000,
  };
}
