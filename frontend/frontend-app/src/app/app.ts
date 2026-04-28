import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  selectedColor = '#d93a3a';

  rows = 20;
  cols = 20;

  cells = Array.from({ length: this.rows * this.cols }, () => '#ffffff');

  paintCell(index: number): void {
    this.cells[index] = this.selectedColor;
  }

}
