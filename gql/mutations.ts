import {gql} from "./__generated__";

export const CREATE_ORDER = gql(`
    mutation CreateOrder($input: CheckoutInput!) {
      createOrder(input: $input) {
        id
        orderId
        amount
        user_email
        user_phone
      }
    }
`)

export const UPDATE_USER = gql(`
    mutation UpdateUser($input: UpdateUserInput!) {
      updateCurrentUser(input: $input) {
        name
        phone
        email
      }
    }
`)
