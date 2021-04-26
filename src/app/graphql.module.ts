import { HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import {
  ApolloClientOptions,
  ApolloLink,
  concat,
  DefaultOptions,
  InMemoryCache,
  fromPromise,
} from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { HttpLink } from 'apollo-angular/http';

import { environment } from '@env/environment';

const uri = `${environment.serverUrl}/graphql`; // <-- add the URL of the GraphQL server here

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const http = httpLink.create({ uri });
  const authMiddleware = new ApolloLink((operation, forward) => {
    const credentials = JSON.parse(localStorage.getItem('credentials'));
    // add the authorization to the headers
    if (credentials) {
      operation.setContext({
        headers: new HttpHeaders().set('Authorization', `Bearer ${credentials.jwtToken}`),
      });
    }

    return forward(operation);
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        const { message, locations, path } = err;
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);

        switch (err.extensions?.code) {
          // when an AuthenticationError is thrown in a resolver
          case 'Unauthorized':
            return fromPromise(getNewToken()).flatMap((res) => {
              // retry the request, returning the new observable
              return forward(operation);
            });
        }
      }
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only', //'cache-and-network'
    },
    query: {
      fetchPolicy: 'no-cache',
    },
  };

  return {
    link: concat(errorLink, concat(authMiddleware, http)),
    cache: new InMemoryCache({
      addTypename: false,
    }),
    defaultOptions,
  };
}

const getNewToken = async (): Promise<string | null> => {
  let newToken = null;
  try {
    const credentials = JSON.parse(localStorage.getItem('credentials'));
    const response: any = await fetch(`${environment.serverUrl}/new-jwt-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${credentials.refreshJwtToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const json = await response.json();
      credentials.jwtToken = json.token;
      localStorage.setItem('credentials', JSON.stringify(credentials));
      newToken = response.token;
    } else {
      localStorage.setItem('credentials', null);
      alert('Tu sesión ha expirado');
      window.location.replace('/');
    }
  } catch (error) {
    console.log(`[Error]: ${error}`);
  } finally {
    return newToken;
  }
};

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
