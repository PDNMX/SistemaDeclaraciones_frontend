import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Apollo } from 'apollo-angular';
import { changeRoles } from '@api/user';
import { Role } from '@models/user';

export interface DialogData {
  _id: string;
  roles: Role[];
  username: string;
}

@Component({
  selector: 'app-change-roles',
  templateUrl: './change-roles.component.html',
  styleUrls: ['./change-roles.component.scss'],
})
export class ChangeRolesComponent implements OnInit {
  allSelected = false;
  roles: { name: string; selected: boolean; value: Role }[] = [
    { name: 'DECLARANTE', selected: false, value: 'USER' },
    { name: 'ADMINISTRATIVO 1', selected: false, value: 'ADMIN' },
    { name: 'ADMINISTRATIVO 2', selected: false, value: 'SUPER_ADMIN' },
    { name: 'ADMINISTRADOR', selected: false, value: 'ROOT' },
  ];

  constructor(
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<ChangeRolesComponent>
  ) {}

  async changeUserRoles() {
    const roles = this.roles.filter((t) => t.selected).map((r) => r.value);
    try {
      await this.apollo
        .mutate({
          mutation: changeRoles,
          variables: {
            roles,
            userID: this.data._id,
          },
        })
        .toPromise();
      this.dialogRef.close(true);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    this.roles.forEach((role, index) => {
      this.roles[index].selected = this.data.roles.includes(role.value);
    });
  }

  setAll(selected: boolean) {
    this.allSelected = selected;
    if (this.roles == null) {
      return;
    }
    this.roles.forEach((t) => (t.selected = selected));
  }

  someSelected(): boolean {
    if (this.roles == null) {
      return false;
    }
    return this.roles.filter((t) => t.selected).length > 0 && !this.allSelected;
  }

  updateAllSelected() {
    this.allSelected = this.roles != null && this.roles.every((t) => t.selected);
  }
}
