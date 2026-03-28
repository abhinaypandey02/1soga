/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    mutation CreateOrder($input: CheckoutInput!) {\n      createOrder(input: $input) {\n        id\n        orderId\n        amount\n        user_email\n        user_phone\n      }\n    }\n": typeof types.CreateOrderDocument,
    "\n    mutation UpdateUser($input: UpdateUserInput!) {\n      updateCurrentUser(input: $input) {\n        name\n        phone\n        email\n      }\n    }\n": typeof types.UpdateUserDocument,
    "\n    query GetOrders {\n      getOrders {\n        id\n        amount\n        status\n        lineItems {\n          id\n          skuId\n          price\n          costPrice\n          quantity\n        }\n      }\n    }\n": typeof types.GetOrdersDocument,
    "\n    query GetOrder($input: Float!) {\n      getOrder(input: $input) {\n        id\n        amount\n        status\n        trackingLink\n        lineItems {\n          id\n          skuId\n          price\n          costPrice\n          quantity\n        }\n      }\n    }\n": typeof types.GetOrderDocument,
};
const documents: Documents = {
    "\n    mutation CreateOrder($input: CheckoutInput!) {\n      createOrder(input: $input) {\n        id\n        orderId\n        amount\n        user_email\n        user_phone\n      }\n    }\n": types.CreateOrderDocument,
    "\n    mutation UpdateUser($input: UpdateUserInput!) {\n      updateCurrentUser(input: $input) {\n        name\n        phone\n        email\n      }\n    }\n": types.UpdateUserDocument,
    "\n    query GetOrders {\n      getOrders {\n        id\n        amount\n        status\n        lineItems {\n          id\n          skuId\n          price\n          costPrice\n          quantity\n        }\n      }\n    }\n": types.GetOrdersDocument,
    "\n    query GetOrder($input: Float!) {\n      getOrder(input: $input) {\n        id\n        amount\n        status\n        trackingLink\n        lineItems {\n          id\n          skuId\n          price\n          costPrice\n          quantity\n        }\n      }\n    }\n": types.GetOrderDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation CreateOrder($input: CheckoutInput!) {\n      createOrder(input: $input) {\n        id\n        orderId\n        amount\n        user_email\n        user_phone\n      }\n    }\n"): (typeof documents)["\n    mutation CreateOrder($input: CheckoutInput!) {\n      createOrder(input: $input) {\n        id\n        orderId\n        amount\n        user_email\n        user_phone\n      }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation UpdateUser($input: UpdateUserInput!) {\n      updateCurrentUser(input: $input) {\n        name\n        phone\n        email\n      }\n    }\n"): (typeof documents)["\n    mutation UpdateUser($input: UpdateUserInput!) {\n      updateCurrentUser(input: $input) {\n        name\n        phone\n        email\n      }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetOrders {\n      getOrders {\n        id\n        amount\n        status\n        lineItems {\n          id\n          skuId\n          price\n          costPrice\n          quantity\n        }\n      }\n    }\n"): (typeof documents)["\n    query GetOrders {\n      getOrders {\n        id\n        amount\n        status\n        lineItems {\n          id\n          skuId\n          price\n          costPrice\n          quantity\n        }\n      }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetOrder($input: Float!) {\n      getOrder(input: $input) {\n        id\n        amount\n        status\n        trackingLink\n        lineItems {\n          id\n          skuId\n          price\n          costPrice\n          quantity\n        }\n      }\n    }\n"): (typeof documents)["\n    query GetOrder($input: Float!) {\n      getOrder(input: $input) {\n        id\n        amount\n        status\n        trackingLink\n        lineItems {\n          id\n          skuId\n          price\n          costPrice\n          quantity\n        }\n      }\n    }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;