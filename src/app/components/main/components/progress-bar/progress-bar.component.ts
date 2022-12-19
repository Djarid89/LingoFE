import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'lng-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements AfterViewInit, OnChanges {
  @Input() show = false;
  @Input() reset = false;
  @Input() stop = false;
  @Output() emitEndTime = new EventEmitter<void>();
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
    }, 50);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.show?.currentValue || changes.reset?.currentValue ) {
      this.greenBar.nativeElement.style.backgroundColor = `#2bc253`;
      if(changes.reset?.currentValue && this.interval) {
        clearInterval(this.interval);
      }
      this.step.value = 100;
      this.interval = setInterval(() => {
        this.frame(this.greenBar, this.step);
        if(this.step.value === 0) {
          clearInterval(this.interval);
        }
      }, 50);
    } else if(changes.show?.currentValue === false) {
      clearInterval(this.interval);
    } else if(changes.stop?.currentValue === true) {
      clearInterval(this.interval);
    }
  }

  private frame(greenBar: any, step: { value: number }) {
    if(!this.greenBar) {
      return;
    }

    step.value -= 0.5;
    greenBar.nativeElement.style.width = `${step.value}%`;
    
    if(step.value === 75) {
      greenBar.nativeElement.style.backgroundColor = `yellow`;
    } else if(step.value === 25) {
      greenBar.nativeElement.style.backgroundColor = `red`;
    } else if(step.value === 0) {
      this.emitEndTime.emit();
    }
  }
}
