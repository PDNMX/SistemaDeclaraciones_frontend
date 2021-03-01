import { HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, concat, DefaultOptions, InMemoryCache } from '@apollo/client/core';
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

  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only', //'cache-and-network'
    },
    query: {
      fetchPolicy: 'network-only',
    },
  };

  return {
    link: concat(authMiddleware, http),
    cache: new InMemoryCache({
      addTypename: false,
    }),
    defaultOptions,
  };
}

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
