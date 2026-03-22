import {setupGraphQL} from 'naystack/graphql'
import OrderResolvers, {OrderFields} from './order'
import UserResolvers from './user'

export const {GET, POST} = await setupGraphQL({
  resolvers:[UserResolvers, OrderResolvers, OrderFields],
  allowedOrigins: ['1soga.com', 'onesoga.com']
})
