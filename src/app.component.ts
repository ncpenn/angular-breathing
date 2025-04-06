import { Component } from '@angular/core';
import { BreathingAppComponent } from './components/breathing-app/breathing-app.component';

@Component({
  imports: [BreathingAppComponent],
  standalone: true,
  selector: 'app-root',
  template: '<breathing-app></breathing-app>',
})
export class AppComponent {}
