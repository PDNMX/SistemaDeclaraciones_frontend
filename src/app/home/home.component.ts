import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  username: string = null;

  constructor(credentialsService: CredentialsService) {
    this.username = credentialsService.credentials?.user.username;
  }

  ngOnInit() {}
}
