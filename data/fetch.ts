import {FetchAllProductsResponse, FetchProductResponse} from "./types";
import {writeFileSync, readFileSync} from "fs";
import {join} from "path";
import {Product} from "./types";
import {applyMerges, mapToProduct} from "./map";
import {mergeConfig} from "./merge-config";

export const FILE_ALL_PRODUCTS = "all_products";
export const FILE_PRODUCT = (id: string) => `product_${id}`;
export const FILE_PRODUCTS = "products";

function saveJson(name: string, data: unknown) {
  writeFileSync(join(process.cwd(), "data", "jsons", `${name}.json`), JSON.stringify(data, null, 2));
}

function loadJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), "data", "jsons", `${name}.json`), "utf-8"));
}

function fetchQikink(url:string, body:string){
  return fetch(
    url,{
      method: "POST",
      headers:{
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "application/json",
        Cookie: process.env.QIKINK_COOKIE!,
      },
      body
    }).then(res=>res.json())
}

export async function fetchAllProducts(){
  const data = await fetchQikink(
    "https://dashboard.qikink.com/index.php/products/fetch_my_products",
    "draw=1&columns%5B0%5D%5Bdata%5D=function&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=function&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=function&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=base_price&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=price_range&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=function&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=50&search%5Bvalue%5D=&search%5Bregex%5D=false&searched_client_product_id=") as FetchAllProductsResponse;
  saveJson(FILE_ALL_PRODUCTS, data);
  return data;
}

export async function fetchProduct(id:string){
  const data = await fetchQikink(
    "https://dashboard.qikink.com/products/get_client_variations_new",
    `client_product_id=${id}&client_product_type_id=10`) as FetchProductResponse;
  saveJson(FILE_PRODUCT(id), data);
  return data;
}

export async function createVariations(){
  const allProducts = await fetchAllProducts();
  const products: Product[] = [];

  for (const product of allProducts.data) {
    const details = await fetchProduct(product.client_product_id);
    products.push(mapToProduct(product, details));
  }

  saveJson(FILE_PRODUCTS, applyMerges(products, mergeConfig));
  return products;
}

export function createVariationsLocal(){
  const allProducts = loadJson<FetchAllProductsResponse>(FILE_ALL_PRODUCTS);
  const products: Product[] = [];

  for (const product of allProducts.data) {
    const details = loadJson<FetchProductResponse>(FILE_PRODUCT(product.client_product_id));
    products.push(mapToProduct(product, details));
  }

  saveJson(FILE_PRODUCTS, applyMerges(products, mergeConfig));
  return products;
}
