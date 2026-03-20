import {getTableColumns, InferModelFromColumns, SQL, sql} from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

// Helper: unwrap SQL<T> or PgColumn into plain TS types
type InferFromShape<T> = {
  [K in keyof T]: T[K] extends SQL<infer U> // if it's a nested SQL<T>, unwrap the inner type
    ? U
    : // if it's a column object map (from getTableColumns)
    T[K] extends Record<string, AnyPgColumn>
      ? InferModelFromColumns<T[K]>
      : // if it's a single PgColumn
      T[K] extends AnyPgColumn
        ? T[K]["_"]["data"]
        : never;
};

export const buildJSONObject = <T extends { id: AnyPgColumn }>(
  table: T,
): SQL<InferFromShape<T>> => {
  const obj = sql<InferFromShape<T>>`json_build_object(
  ${sql.join(
    // @ts-expect-error -- expected
    Object.entries(getTableColumns(table)).map(
      ([key, col]) => sql`${sql.raw(`'${key}'`)}, ${col}`,
    ),
    sql`,`,
  )}
  )`;

  return sql<InferFromShape<T>>`
    CASE
      WHEN ${table.id} IS NOT NULL
    THEN ${obj}
    ELSE NULL
    END
  `;
};


export const agg = <T extends { id: AnyPgColumn }>(
  table: T,
): SQL<InferFromShape<T>[]> => {
  return sql<InferFromShape<T>[]>`
    COALESCE(
                  json_agg(DISTINCT ${buildJSONObject(table)}::jsonb)
    FILTER (WHERE ${table.id} IS NOT NULL),
    '[]'
    )
  `;
};
