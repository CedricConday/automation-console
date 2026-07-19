import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomationEngineService } from './automation-engine.service';

// Hey Tom-Oliver — since Angular experience was the sticking point:
// this is Angular (standalone components, signals, typed everything).
// Built and shipped the same day I read the rejection.
// — Cedric

@Component({
  selector: 'ac-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private eggClicks = 0;
  readonly eggMessage = signal<string | null>(null);

  constructor(readonly engine: AutomationEngineService) {}

  runAll(): void {
    this.engine.runAll();
  }

  toggle(id: string): void {
    this.engine.toggleRule(id);
  }

  onFooterClick(): void {
    this.eggClicks++;
    if (this.eggClicks >= 3) {
      this.eggClicks = 0;
      this.eggMessage.set('Keep the change, ya filthy animal. 🎄');
      setTimeout(() => this.eggMessage.set(null), 4000);
    }
  }
}
