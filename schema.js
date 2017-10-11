import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolver.js';

const typeDefs = `
  type measures {
    temperature: String
    time: String
  }

  type Weather {
    timestamp: String
    days: [measures]
  }

  type Query {
    weather(place: String!): Weather
  }
`;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {},
});