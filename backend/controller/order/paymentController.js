const stripe = require('../../config/stripe');
const userModel = require('../../models/userModel'); // Ensure this is correct

const payementController = async (request, response) => {
    try {
        console.log("request.body", request.body);

        const user = await userModel.findOne({ _id: request.userId });
        const cartItems = request.body.cartItems; // Make sure cartItems is defined
        const params = {
            submit_type: 'pay',
            mode: "payment",
            payment_method_types: ["card"],
            shipping_address_collection: {
                allowed_countries: ["US", "CA","TN" ,"KE"],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 0,
                            currency: "eur",
                        },
                        display_name: "Free shipping",
                        // Delivers between 5-7 business days
                        delivery_estimate: {
                            minimum: {
                                unit: "business_day",
                                value: 5,
                            },
                            maximum: {
                                unit: "business_day",
                                value: 7,
                            },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 1500,
                            currency: "eur",
                        },
                        display_name: "Next day air",
                        // Delivers in exactly 1 business day
                        delivery_estimate: {
                            minimum: {
                                unit: "business_day",
                                value: 1,
                            },
                            maximum: {
                                unit: "business_day",
                                value: 1,
                            },
                        },
                    },
                },
            ],
            phone_number_collection: {
                enabled: true,
            },
            customer_email: user.email,
            metadata: {
                userId: request.userId
            },
            line_items: cartItems.map((item, index) => {
                return {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: item.productId.productName,
                            images: item.productId.productImage,
                            metadata: {
                                productId: item.productId._id
                            }
                        },
                        unit_amount: item.productId.sellingPrice * 100 // Stripe expects amount in cents
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1
                    },
                    quantity: item.quantity
                };
            }),
            success_url : `${process.env.FRONTEND_URL}success`,
          cancel_url : `${process.env.FRONTEND_URL}cancel`,
        };

        const session = await stripe.checkout.sessions.create(params);
        response.status(303).json(session);
    } catch (error) {
        response.json({
            message: error?.message || error,
            error: true,
            success: false
        });
    }
};

module.exports = payementController;