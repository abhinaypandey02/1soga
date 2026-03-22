import {setupGraphQL} from 'naystack/graphql'
import OrderResolvers, {OrderFields} from './order'
import UserResolvers from './user'

export const {GET, POST, OPTIONS} = await setupGraphQL({
  resolvers:[UserResolvers, OrderResolvers, OrderFields],
  allowedOrigins: ['https://1soga.com', 'https://onesoga.com']
})
