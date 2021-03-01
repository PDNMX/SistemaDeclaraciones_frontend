import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  userId: string = null;

  constructor(private apollo: Apollo, private activatedRoute: ActivatedRoute) {
    this.getUserInfo();
  }

  async getUserInfo() {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}
}
