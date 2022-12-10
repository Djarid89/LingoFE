import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Cell } from '../../class/lingo';

@Component({
  selector: 'lng-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {
  @Input() cell!: Cell;
  @Output() emitLetterChange = new EventEmitter<string>();
  @ViewChild("input") input!: ElementRef;

  onLetterChange(newLetter: string): void {
    this.cell.letter = newLetter.charAt(newLetter.length - 1).toUpperCase();
    this.input.nativeElement.blur();
    this.emitLetterChange.emit(this.cell.letter);
  }

  removeLetter(): void {
    this.cell.letter = '';
    this.emitLetterChange.emit('');
  }
}
