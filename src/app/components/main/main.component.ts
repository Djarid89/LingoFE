import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  showProgressBar = false;

  setShowProgressBar(showProgressBar: boolean): void {
    this.showProgressBar = showProgressBar;
  }
}
