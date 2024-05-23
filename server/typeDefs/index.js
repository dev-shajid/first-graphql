const {mergeTypeDefs} = require('@graphql-tools/merge')

const transactionTypeDef = require('./transaction.typeDef')
const userTypeDef = require('./user.typeDef')

const typeDefs=mergeTypeDefs([userTypeDef, transactionTypeDef])

module.exports=typeDefs