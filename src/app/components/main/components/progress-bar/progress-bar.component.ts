import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'lng-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnChanges {
  @Input() show = false;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.show.currentValue) {
      const elem = document.getElementById("greenBar");
      let stepValue = 100;
      let id = setInterval(frame, 100);
    
      function frame() {
        if(!elem) {
          return;
        }
  
        if (stepValue === 0) {
          clearInterval(id);
        } else if(stepValue === 25) {
          stepValue -= 1;
          elem.style.backgroundColor = `red`;
        } else if(elem) {
          stepValue -= 1;
          elem.style.width = `${stepValue}%`;
        }
      }
    }
  }
}
