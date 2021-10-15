import gql from 'graphql-tag';

export const changePassword = gql`
  mutation changePassword($oldPassword: LimitedString!, $newPassword: LimitedString!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

export const changeRoles = gql`
  mutation changeRoles($userID: LimitedString!, $roles: [Role!]!) {
    changeRoles(userID: $userID, roles: $roles) {
      _id
      username
      nombre
      primerApellido
      segundoApellido
      curp
      rfc
      roles
      institucion {
        clave
        valor
      }
      createdAt
      updatedAt
    }
  }
`;

export const resetPassword = gql`
  mutation resetPassword($token: String!, $newPassword: LimitedString!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

export const signup = gql`
  mutation signup($user: UserSignUpInput!) {
    signup(user: $user) {
      _id
      username
      nombre
      primerApellido
      segundoApellido
      curp
      rfc
      roles
      institucion {
        clave
        valor
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateUserProfile = gql`
  mutation updateUserProfile($profile: UserProfileInput!) {
    updateUserProfile(profile: $profile) {
      _id
      username
      nombre
      primerApellido
      segundoApellido
      curp
      rfc
      institucion {
        clave
        valor
      }
    }
  }
`;
