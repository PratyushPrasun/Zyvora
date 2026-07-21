import Address from "../models/Address.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

/**
 * Convert an Address document into
 * an immutable order shipping snapshot.
 */
export const buildShippingAddress = (address) => {

    return {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
    };

};

/**
 * Convert cart items into immutable order items.
 * Also calculates subtotal.
 */
export const buildOrderItems = (cartItems) => {

    const orderItems = [];

    let subtotal = 0;

    for (const item of cartItems) {

        const product = item.product;

        const price = Number(product.price);

        subtotal += price * item.quantity;

        orderItems.push({

            product: product._id,

            title: product.title,

            image: product.images?.find(img => img.isPrimary)?.url ||
                   product.images?.[0]?.url ||
                   "",

            price,

            quantity: item.quantity,

        });

    }

    return {

        orderItems,

        subtotal,

    };

};

/**
 * Calculate all monetary values
 * for an order.
 */
export const calculateOrderTotals = (
    subtotal,
    options = {}
) => {

    const {

        shippingCharge = subtotal >= 1000 ? 0 : 100,

        taxRate = 0,

        discount = 0

    } = options;

    const tax = Number(
        ((subtotal * taxRate) / 100).toFixed(2)
    );

    const totalAmount =
        subtotal +
        shippingCharge +
        tax -
        discount;

    return {

        subtotal,

        shippingCharge,

        tax,

        discount,

        totalAmount

    };

};

/**
 * Validate user's cart.
 */

export const validateCart = async (

    userId,

    session

) => {

    const cart = await Cart.findOne({

        user: userId,

    })

        .populate("items.product")

        .session(session);

    if (!cart) {

        throw new Error("Cart not found.");

    }

    if (cart.items.length === 0) {

        throw new Error("Cart is empty.");

    }

    return cart;

};

/**
 * Validate stock availability.
 */

export const validateStock = async (

    cartItems,

    session

) => {

    for (const item of cartItems) {

        const product = await Product.findById(

            item.product._id

        ).session(session);

        if (item.product.stock < item.quantity) {

    throw new Error(
        `${item.product.title} has only ${item.product.stock} items left.`
    );

}

        if (!product) {

            throw new Error(

                `${item.product.title} not found.`

            );

        }

        if (product.stock < item.quantity) {

            throw new Error(

                `${product.title} has only ${product.stock} items left.`

            );

        }

    }

};

/**
 * Reduce product stock atomically.
 */

export const reduceStock = async (

    orderItems,

    session

) => {

    for (const item of orderItems) {

        const updatedProduct =

            await Product.findOneAndUpdate(

                {

                    _id: item.product,

                    stock: {

                        $gte: item.quantity

                    }

                },

                {

                    $inc: {

                        stock: -item.quantity

                    }

                },

                {

                    new: true,

                    session

                }

            );

        if (!updatedProduct) {

            throw new Error(

                `Insufficient stock for ${item.title}.`

            );

        }

    }

};

/**
 * Clear user's cart.
 */

export const clearCart = async (

    cart,

    session

) => {

    cart.items = [];

    await cart.save({

        session

    });

};


export const createOrderFromCart = async ({
    userId,
    addressId,
    paymentMethod,
    paymentStatus = "Pending",
    paymentInfo = {},
    session,
}) => {

    // ----------------------------
    // 1. Fetch Address
    // ----------------------------
    const address = await Address.findOne({
        _id: addressId,
        user: userId,
    }).session(session);

    if (!address) {
        throw new Error("Address not found.");
    }

    // ----------------------------
    // 2. Validate Cart
    // ----------------------------
    const cart = await validateCart(
        userId,
        session
    );

    // ----------------------------
    // 3. Validate Stock
    // ----------------------------
    await validateStock(
        cart.items,
        session
    );

    // ----------------------------
    // 4. Build Shipping Address
    // ----------------------------
    const shippingAddress =
        buildShippingAddress(address);

    // ----------------------------
    // 5. Build Order Items
    // ----------------------------
    const {

        orderItems,

        subtotal,

    } = buildOrderItems(
        cart.items
    );

    // ----------------------------
    // 6. Calculate Totals
    // ----------------------------
    const {

        shippingCharge,

        tax,

        discount,

        totalAmount,

    } = calculateOrderTotals(
        subtotal
    );

    // ----------------------------
    // 7. Create Order
    // ----------------------------
    const [order] = await Order.create(
        [
            {

                user: userId,

                items: orderItems,

                shippingAddress,

                paymentMethod,

                paymentStatus,

                paymentInfo,

                subtotal,

                shippingCharge,

                tax,

                discount,

                totalAmount,

            },
        ],
        {
            session,
        }
    );

    // ----------------------------
    // 8. Reduce Stock
    // ----------------------------
    await reduceStock(
        orderItems,
        session
    );

    // ----------------------------
    // 9. Clear Cart
    // ----------------------------
    await clearCart(
        cart,
        session
    );

    return order;

};