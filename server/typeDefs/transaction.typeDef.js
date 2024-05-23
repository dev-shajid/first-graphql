const transactionTypeDef = `#graphql
    type Transaction {
        _id: ID!
        userId: ID!
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        date: String!
        location:String!
        user: User!
    }

    type CategoryType{ category: String, totalAmount: Float }

    type Query{
        transactions: [Transaction!]
        transaction(transactionId: ID!): Transaction
        categoryStatistics: [CategoryType!]
    }

    type Mutation{
        createTransaction(input:CreateTransactionInput!): Transaction!
        updateTransaction(input:UpdateTransactionInput!): Transaction!
        deleteTransaction(transactionId:ID!): Transaction!
    }

    input CreateTransactionInput{
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        date: String!
        location:String!
    }

    input UpdateTransactionInput{
        transactionId: ID!
        description: String
        paymentType: String
        category: String
        amount: Float
        date: String
        location:String
    }
`

export default transactionTypeDef