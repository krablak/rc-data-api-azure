import { gql, ApolloServer } from 'apollo-server-azure-functions'
import { GraphQLDate } from './graphQLDate'
import { isDefined, isDateIn } from './filterUtils'
import { Data } from './data'

export interface Coordinate {
  lat: number
  lng: number
}

export interface Closure {
  type: string
  coordinates: Coordinate[][]
  validFrom: Date
  validTo: Date
  description: string
}

// Reload data from local files
let closuresData = Data.loadFromLocalFiles();

// Plan data reload each 10 minutes
let reload = () => {
  Data.reloadFromEsriDump().then(data => closuresData = data);
  setTimeout(() => reload(), 1000 * 60 * 10);
}
reload();

// GraphQL types definition
const typeDefs = gql`
  # Custom type for date
  scalar GraphQLDate

  # Road closure
  type Closure {
    # Type of road to which is location
    type: RoadType!
    # Coordinates of location to which is closure related
    coordinates: [[Coordinate!]!]!
    # Start of closure validity
    validFrom: GraphQLDate!
    # End of closure validity
    validTo: GraphQLDate!
    # Human readable description
    description: String!
  }

  # Road type
  enum RoadType {
    # Highway
    D
    # Road I. class
    R1
    # Road II. or III. class
    R23
  }

  # Location coordinate
  type Coordinate {
      lat: Float!
      lng: Float!
  }

  type Query {
    closures(type: [String], validFrom: GraphQLDate, validTo: GraphQLDate): [Closure]
  }
`

const resolvers = {
  Query: {
    closures: (parent: any, args: any, context: any, info: any) => closuresData
      .filter(closure => (isDefined(args.type) && args.type.length && args.type.length > 0) ? args.type.indexOf(closure.type) !== -1 : true)
      .filter(closure => {
        let res = true
        if (isDefined(args.validFrom, args.validTo)) {
          res = isDateIn(closure.validFrom, args.validFrom, args.validTo) || isDateIn(closure.validTo, args.validFrom, args.validTo)
        } else if (isDefined(args.validFrom)) {
          res = isDateIn(closure.validFrom, args.validFrom, new Date(2050))
        } else if (isDefined(args.validTo)) {
          res = isDateIn(closure.validTo, new Date(0), args.validTo)
        }
        return res
      })
  },
  GraphQLDate: GraphQLDate
}

const server = new ApolloServer({ typeDefs, resolvers });

module.exports = server.createHandler({
  cors: {
    origin: '*',
    credentials: false,
  },
});