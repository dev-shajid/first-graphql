import { mergeTypeDefs } from '@graphql-tools/merge'
import transactionTypeDef from './transaction.typeDef.js'
import userTypeDef from './user.typeDef.js'

const typeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef])

export default typeDefs