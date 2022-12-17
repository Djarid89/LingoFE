import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Cell } from '../../class/lingo';
import { CellState } from '../../interface/lingo';

@Component({
  selector: 'lng-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnChanges {
  @Input() cell!: Cell;
  @Input() isVisible = false;
  @Input() isOnFocus = false;
  @Output() emitLetterChange = new EventEmitter<string>();
  @ViewChild("input") input!: ElementRef;
  CellState = CellState;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.isOnFocus) {
      if(changes.isOnFocus.currentValue) {
        setTimeout(() => {
          this.input.nativeElement.focus();
        });
      }
    }
  }

  onLetterChange(newLetter: string): void {
    this.cell.letter = newLetter.charAt(newLetter.length - 1).toUpperCase();
    this.input.nativeElement.blur();
    this.emitLetterChange.emit(this.cell.letter);
  }

  removeLetter(): void {
    if(this.cell.state === CellState.find) {
      return;
    }

    this.cell.letter = '';
  }
}
