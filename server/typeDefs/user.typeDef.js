const userTypeDef = `#graphql
    type User {
        _id: ID!
        name: String!
        username: String!
        password: String!
        profilePicture: String
        gender: String!
        transactions: [Transaction!]
    }

    type Query{
        getUser(userId: ID!): User
        authUser: User
    }

    type Mutation{
        signup(input:SignUpInput!): User
        login(input:LoginInput!): User
        logout: LogoutResponse
    }

    input SignUpInput{
        name: String!
        username: String!
        password: String!
        profilePicture: String
        gender: String!
    }

    input LoginInput{
        username: String!
        password: String!
    }

    type LogoutResponse{
        message: String!
    }
`

module.exports = userTypeDef