import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  showProgressBar = false;
  newGame = false;
  size = 5;

  setShowProgressBar(showProgressBar: boolean): void {
    this.showProgressBar = showProgressBar;
  }

  setNewGame(): void {
    this.newGame = true;
    setTimeout(() => this.newGame = false);
  }
}
