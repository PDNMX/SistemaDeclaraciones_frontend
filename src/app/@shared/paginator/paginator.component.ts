import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  @Input() pageSize = 10;
  @Input() totalDocs = 1;
  @Output() siguienteClicked: EventEmitter<any> = new EventEmitter<any>();
  currentPage = 0;

  constructor() {}

  arrowClicked(arrow: string) {
    if (arrow === 'back' && this.currentPage > 1) {
      this.sendEvent(this.currentPage + 1);
    } else if (arrow === 'next' && this.totalDocs > (this.currentPage + 1) * this.pageSize) {
      this.sendEvent(this.currentPage - 1);
    }
  }

  lastPage() {
    return Math.ceil(this.totalDocs / this.pageSize);
  }

  ngOnInit(): void {}

  sendEvent(Num: number) {
    this.siguienteClicked.emit(Num);
  }
}
