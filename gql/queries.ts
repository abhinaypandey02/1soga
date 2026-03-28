import {gql} from "./__generated__";

export const GET_ORDERS = gql(`
    query GetOrders {
      getOrders {
        id
        amount
        status
        lineItems {
          id
          skuId
          price
          costPrice
          quantity
        }
      }
    }
`)

export const GET_ORDER = gql(`
    query GetOrder($input: Float!) {
      getOrder(input: $input) {
        id
        amount
        status
        trackingLink
        lineItems {
          id
          skuId
          price
          costPrice
          quantity
        }
      }
    }
`)
