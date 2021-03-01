import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrls: ['./preguntas-frecuentes.component.scss'],
})
export class PreguntasFrecuentesComponent implements OnInit {
  section = 'GENERALIDADES';

  constructor() {}

  ngOnInit(): void {}

  sectionChanged(section: string) {
    this.section = section;
  }
}
