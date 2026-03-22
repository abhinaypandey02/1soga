import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest)=>{
    const data = await req.json()
    console.log({
        addresses:data.addresses.map((address:object)=>({
      ...address,
      // @ts-expect-error -- test
      id:address.id,
      // @ts-expect-error -- test
      zipcode:address.zipcode,
      // @ts-expect-error -- test
      country:address.country,
      "shipping_methods": [
        {
          "id": "1",
          "description": "BlueDart Shipping",
          "name": "Delivery within a week",
          "serviceable": true,
          "shipping_fee": 5000, // in paise. Here 1000 = 1000 paise, which equals to ₹10
          "cod": true,
          "cod_fee": 1000 // in paise. Here 1000 = 1000 paise, which equals to ₹10
        },
      ]
}))
    })
    return NextResponse.json({
        addresses:data.addresses.map((address:object)=>({
      ...address,
      // @ts-expect-error -- test
      id:address.id,
      // @ts-expect-error -- test
      zipcode:address.zipcode,
      // @ts-expect-error -- test
      country:address.country,
      "shipping_methods": [
        {
          "id": "1",
          "description": "BlueDart Shipping",
          "name": "Delivery within a week",
          "serviceable": true,
          "shipping_fee": 5000, // in paise. Here 1000 = 1000 paise, which equals to ₹10
          "cod": true,
          "cod_fee": 1000 // in paise. Here 1000 = 1000 paise, which equals to ₹10
        },
      ]
}))
    })
}