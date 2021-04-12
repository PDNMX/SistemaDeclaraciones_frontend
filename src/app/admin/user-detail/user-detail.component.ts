import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { userProfileQuery } from '@api/user';
import { Role, User } from '@models/user';
import { ROLES } from '@utils/constants';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  userID: string = null;

  user: User = null;

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
    this.userID = this.route.snapshot.paramMap.get('id') || null;
    this.getUserInfo(this.userID);
  }

  async getUserInfo(id: string) {
    try {
      const { data }: any = await this.apollo
        .query({
          query: userProfileQuery,
          variables: {
            id,
          },
        })
        .toPromise();

      this.user = data.userProfile || null;
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}

  transformRoles(roles: Role[]) {
    return roles.map((r) => {
      return ROLES[r];
    });
  }
}
