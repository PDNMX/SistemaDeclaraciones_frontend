import gql from 'graphql-tag';

export const forgotPassword = gql`
  query forgotPassword($username: LimitedString!) {
    forgotPassword(username: $username)
  }
`;

export const login = gql`
  query login($username: Email!, $password: LimitedString!) {
    login(username: $username, password: $password) {
      user {
        _id
        username
        nombre
        primerApellido
        segundoApellido
        curp
        rfc
        roles
        createdAt
      }
      jwtToken
    }
  }
`;

export const userProfileQuery = gql`
  query userProfile {
    userProfile {
      _id
      username
      nombre
      primerApellido
      segundoApellido
      curp
      rfc
      roles
      createdAt
      updatedAt
    }
  }
`;

export const search = gql`
  query search($keyword: LimitedString!, $pageNumber: Int) {
    search(keyword: $keyword, pageNumber: $pageNumber) {
      docs {
        _id
        username
        nombre
        primerApellido
        segundoApellido
        curp
        rfc
        roles
        createdAt
      }
      pageNumber
    }
  }
`;

export const users = gql`
  query users($pageNumber: Int) {
    users(pageNumber: $pageNumber) {
      docs {
        _id
        username
        nombre
        primerApellido
        segundoApellido
        curp
        rfc
        roles
        createdAt
      }
      pageNumber
    }
  }
`;
