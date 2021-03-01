import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  @Input() maxPages = 2;
  @Output() siguienteClicked: EventEmitter<any> = new EventEmitter<any>();
  currentPage = 2;

  arrowClicked(arrow: string) {
    if (arrow === 'back' && this.currentPage > 1) {
      this.sendEvent(this.currentPage + 1);
    } else if (arrow === 'next' && this.maxPages < this.currentPage) {
      this.sendEvent(this.currentPage - 1);
    }
  }

  constructor() {}
  ngOnInit(): void {}

  sendEvent(Num: number) {
    this.siguienteClicked.emit(Num);
  }
}
