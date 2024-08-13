import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import moment from 'moment'
const OrderPage = () => {
    const [data, setData] = useState([])

    const fetchOrderDetails = async () => {
        const response = await fetch(SummaryApi.getOrder.url, {
            method: SummaryApi.getOrder.method,
            credentials: 'include'
        })

        const responseData = await response.json()

        setData(responseData.data)
        console.log("order list", responseData)
    }

    useEffect(() => {
        fetchOrderDetails()
    }, [])
    return (
        <div>
            {
                !data[0] && (
                    <p>No Order available</p>
                )
            }

            <div>
                {
                    data.map((item, index) => (
                        <div key={item.userId + index}>
                            <p className='font-medium text-lg'>{moment(item.createdAt).format('LL')}</p>
                            <div>
                                {
                                    item?.productDetails.map((product, index) => (
                                        <div key={product.productId + index}>
                                            <img
                                                src={product.image[0]}
                                                className='w-28 h-28 bg-slate-200 object-scale-down p-2'
                                            />
                                            <div>{product.name}</div>
                                            <div className='flex items-center gap-5'>
                                                <div>{displayINRCurrency(product.price)}</div>
                                                <p>Quantity : {product.quantity}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default OrderPage;