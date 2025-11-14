import { Component } from '@angular/core';
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
export class UserDetailComponent {
  userID: string = null;

  user: User = null;

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
    this.userID = this.route.snapshot.paramMap.get('id') || null;
    this.getUserInfo(this.userID);
  }

  async getUserInfo(id: string) {
    try {
      const { data } = await this.apollo
        .query({
          query: userProfileQuery,
          variables: {
            id,
          },
        })
        .toPromise();

      const result = data as any;
      this.user = result.userProfile || null;
    } catch (error) {
      console.log(error);
    }
  }

  transformRoles(roles: Role[]) {
    return roles.map((r) => {
      return ROLES[r];
    });
  }
}
