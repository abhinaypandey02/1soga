import {NextRequest, NextResponse} from "next/server";
import {createVariationsLocal, fetchAllProducts, fetchProduct} from "@/data/fetch";

export const GET=async ()=>{
  return NextResponse.json(createVariationsLocal());
}
