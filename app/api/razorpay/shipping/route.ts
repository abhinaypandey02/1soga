import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest)=>{
    const data = await req.json()
    console.log("data", JSON.stringify(data,null,2))
    const response = {
        order_id: data.order_id,
        razorpay_order_id: data.razorpay_order_id,
        addresses:data.addresses.map((address:object)=>({
      ...address,
      "serviceable": true,
      "cod": false,
      "cod_fee": 0,
      "shipping_fee": 5000,
      "shipping_methods": [
        {
          "id": "1",
          "description": "BlueDart Shipping",
          "name": "Delivery within a week",
          "serviceable": true,
          "shipping_fee": 5000,
          "cod": false,
          "cod_fee": 0
        },
      ]
}))
    }
    console.log("response", JSON.stringify(response,null,2))
    return NextResponse.json(response)
}