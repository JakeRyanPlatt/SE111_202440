import { Component, computed, signal } from '@angular/core';

type RobotStatus = 'online' | 'scanning' | 'alert' | 'idle';

interface StatusDetails {
  label: string;
  message: string;
  tone: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly statusDetails: Record<RobotStatus, StatusDetails> = {
    online: {
      label: 'Online',
      message: 'All green systems are stable and waiting for the next command.',
      tone: '#76ff9d',
    },
    scanning: {
      label: 'Scanning',
      message: 'Performing a full environmental sweep and sensor calibration.',
      tone: '#9cf6b4',
    },
    alert: {
      label: 'Alert',
      message: 'Minor anomaly detected, but robotic systems remain in safe mode.',
      tone: '#ffc857',
    },
    idle: {
      label: 'Idle',
      message: 'Power is stable and the unit is resting in standby mode.',
      tone: '#91d4ff',
    },
  };

  protected readonly powered = signal(true);
  protected readonly batteryLevel = signal(78);
  protected readonly status = signal<RobotStatus>('online');

  protected readonly statusLabel = computed(
    () => this.statusDetails[this.status()].label,
  );
  protected readonly statusMessage = computed(
    () => this.statusDetails[this.status()].message,
  );
  protected readonly statusTone = computed(
    () => this.statusDetails[this.status()].tone,
  );

  protected togglePower(): void {
    if (this.powered()) {
      this.powered.set(false);
      this.batteryLevel.set(0);
      this.status.set('idle');
      return;
    }

    this.powered.set(true);
    this.batteryLevel.set(82);
    this.status.set('online');
  }

  protected runScan(): void {
    if (!this.powered()) {
      this.status.set('idle');
      return;
    }

    this.status.set('scanning');
    this.batteryLevel.update((level) => Math.max(0, level - 8));
    window.setTimeout(() => {
      if (this.powered()) {
        this.status.set('online');
      }
    }, 1400);
  }

  protected runDiagnostics(): void {
    if (!this.powered()) {
      this.status.set('idle');
      return;
    }

    this.status.set('alert');
    this.batteryLevel.update((level) => Math.min(100, level + 6));
    window.setTimeout(() => {
      if (this.powered()) {
        this.status.set('online');
      }
    }, 1600);
  }
}
