import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  showProgressBar = false;
  newGame = false;
  timeIsUp = false;
  resetProgressBar = false;
  stopProgressBar = false;
  size = 5;

  setShowProgressBar(showProgressBar: boolean): void {
    this.showProgressBar = showProgressBar;
  }

  setNewGame(): void {
    this.newGame = true;
    this.setResetProgressBar();
    setTimeout(() => this.newGame = false);
  }

  setTimeIsUp(): void {
    this.timeIsUp = true;
    setTimeout(() => this.timeIsUp = false);
  }

  setResetProgressBar(): void {
    this.resetProgressBar = true;
    setTimeout(() => this.resetProgressBar = false);
  }

  setStopProgressBar(): void {
    this.stopProgressBar = true;
    setTimeout(() => this.stopProgressBar = false);
  }
}
