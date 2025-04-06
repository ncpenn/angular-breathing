import { Component, Input } from '@angular/core';
import { BreathStagesComponent } from '../breath-stages/breath-stages.component';
import { CommonModule } from '@angular/common';

interface BreathingPhase {
  name: string;
  baseDuration: number;
  currentDuration: number;
}

interface BreathingPattern {
  name: string;
  phases: BreathingPhase[];
}

@Component({
  selector: 'phase-carousel',
  standalone: true,
  imports: [BreathStagesComponent, CommonModule],
  templateUrl: './phase-carousel.component.html',
  styleUrls: ['./phase-carousel.component.scss'],
})
export class PhaseCarouselComponent {
  @Input() selectedPattern!: BreathingPattern;
  @Input() currentPhaseIndex!: number;
  @Input() isActive!: boolean;
  @Input() timeElapsed!: number;
}
