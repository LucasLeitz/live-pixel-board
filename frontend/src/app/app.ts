import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  @ViewChild('board') boardElement!: ElementRef;

  selectedColor = '#d93a3a';

  rows = 20;
  cols = 20;

  isPainting = false;

  socket!: WebSocket;
  isConnected: boolean = false;

  cells = Array.from({ length: this.rows * this.cols }, () => '#ffffff');

  ngOnInit(): void {
    this.connectWebSocket();
  }

  paintCell(index: number): void {
    if (this.cells[index] === this.selectedColor) {
      return;
    }

    this.cells[index] = this.selectedColor;

    const pixelUpdate = {
      index: index,
      color: this.selectedColor
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(pixelUpdate));
    }
  }

  startPainting(index: number): void {
    this.isPainting = true;
    this.paintCell(index);
  }

  stopPainting() {
    this.isPainting = false;
  }

  paintCellOnDrag(index: number): void {
    if (this.isPainting) {
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

  connectWebSocket(): void {
    this.socket = new WebSocket('ws://localhost:8080/ws/pixels');

    this.socket.onopen = () => {
      this.isConnected = true;
      console.log('Connected to WebSocket');
    };

    this.socket.onmessage = (event) => {
      const pixelUpdate = JSON.parse(event.data);

      this.cells[pixelUpdate.index] = pixelUpdate.color;
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      console.log('Disconnected from WebSocket');

      setTimeout(() => {
        this.connectWebSocket();
      }, 2000);
    };
  }
}
