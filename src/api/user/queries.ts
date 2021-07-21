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
        institucion {
          clave
          valor
        }
        createdAt
      }
      refreshJwtToken
      jwtToken
    }
  }
`;

export const userProfileQuery = gql`
  query userProfile($id: ID) {
    userProfile(id: $id) {
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

export const search = gql`
  query search($keyword: LimitedString!, $pagination: PaginationOptionsInput) {
    search(keyword: $keyword, pagination: $pagination) {
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      hasMore
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
    }
  }
`;

export const users = gql`
  query users($pagination: PaginationOptionsInput) {
    users(pagination: $pagination) {
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
      prevPage
      nextPage
      hasMore
      docs {
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
      }
    }
  }
`;
