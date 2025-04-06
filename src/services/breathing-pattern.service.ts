import { Injectable } from "@angular/core";
import { BreathingPattern } from "../interfaces/BreathingPattern";

@Injectable({
  providedIn: "root",
})
export class BreathingPatternsService {
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
}
