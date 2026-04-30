import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild('board') boardElement!: ElementRef;

  selectedColor = '#d93a3a';

  rows = 20;
  cols = 20;

  isPainting = false;

  cells = Array.from({ length: this.rows * this.cols }, () => '#ffffff');

  paintCell(index: number): void {
    this.cells[index] = this.selectedColor;
  }

  startPainting(index: number): void {
    this.isPainting = true;
    this.paintCell(index);
  }

  stopPainting() {
    this.isPainting = false;
  }

  paintCellOnDrag(index: number): void {
    if(this.isPainting) {
      this.paintCell(index);
    }
  }

  clearBoard(): void {
    this.cells = Array.from({ length: this.rows * this.cols }, () => '#ffffff');
  }

  changeGridSize(size: number): void {
    this.rows = size;
    this.cols = size;
    this.clearBoard();
  }

  saveBoardAsImage(): void {
    html2canvas(this.boardElement.nativeElement).then(canvas => {
      const link = document.createElement('a');
      link.download = 'pixel-board.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

}
