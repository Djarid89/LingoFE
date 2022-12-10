import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'lng-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements AfterViewInit, OnChanges {
  @Input() show = false;
  private interval: any;
  private step = { value: 100 };
  @ViewChild("greenBar") greenBar!: ElementRef<HTMLSpanElement>;

  ngAfterViewInit(): void {
    this.step = { value: 100 };
    this.interval = setInterval(() => {
      this.frame(this.greenBar, this.step);
      if(this.step.value === 0) {
        clearInterval(this.interval);
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.show.currentValue) {
      this.step.value = 100;
      this.interval = setInterval(() => {
        this.frame(this.greenBar, this.step);
        if(this.step.value === 0) {
          clearInterval(this.interval);
        }
      }, 100);
    } else {
      clearInterval(this.interval);
    }
  }

  private frame(greenBar: any, step: { value: number }) {
    if(!this.greenBar) {
      return;
    }

    step.value -= 1;
    greenBar.nativeElement.style.width = `${step.value}%`;
    
    if(step.value === 25) {
      greenBar.nativeElement.style.backgroundColor = `red`;
    }
  }
}
