import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
})
export class SectionHeaderComponent implements OnInit {
  @Input() section = '';
  @Input() simplificada = false;
  @Input() progress = 0;
  @Input() type = '';

  constructor() {}

  ngOnInit(): void {}
}
