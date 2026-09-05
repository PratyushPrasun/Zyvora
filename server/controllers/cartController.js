import Cart from "../models/cart.js";
import Product from "../models/product.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc Add Product to Cart
// @route POST /api/cart
// @access Private

export const addToCart = asyncHandler(async (req, res) => {

    const { productId, quantity } = req.body;

    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required."
        });
    }

    // Check Product
    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found."
        });
    }

    // Find User Cart
    let cart = await Cart.findOne({
        user: req.user._id
    });

    // Create Cart if not exists
    if (!cart) {

        cart = await Cart.create({
            user: req.user._id,
            items: [
                {
                    product: productId,
                    quantity: Number(quantity) || 1
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: "Product added to cart.",
            cart
        });

    }

    // Check if Product already exists
    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (itemIndex > -1) {

        cart.items[itemIndex].quantity += Number(quantity) || 1;

    } else {

        cart.items.push({
            product: productId,
            quantity: Number(quantity) || 1
        });

    }

    await cart.save();

    res.status(200).json({
        success: true,
        message: "Cart updated successfully.",
        cart
    });

});

// @desc Get Logged In User Cart
// @route GET /api/cart
// @access Private

export const getCart = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne({
        user: req.user._id
    }).populate({
        path: "items.product",
        select: "title price images stock category brand isActive"
    });

    if (!cart) {
        return res.status(200).json({
            success: true,
            cart: {
                items: []
            }
        });
    }

    // Purge items where product was deleted from DB (item.product === null)
    const validItems = cart.items.filter(item => item.product !== null && item.product !== undefined);
    if (validItems.length !== cart.items.length) {
        cart.items = validItems;
        await cart.save();
    }

    res.status(200).json({
        success: true,
        cart
    });

});

// @desc Update Cart Item Quantity
// @route PUT /api/cart/:productId
// @access Private

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (!productId || productId === 'null' || productId === 'undefined') {
    return res.status(400).json({
      success: false,
      message: "Valid product ID is required.",
    });
  }

  // Validate quantity
  if (!quantity || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be at least 1.",
    });
  }

  // Find user's cart
  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found.",
    });
  }

  // Find product inside cart
  const cartItem = cart.items.find(
    (item) => item.product && item.product.toString() === productId
  );

  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: "Product not found in cart.",
    });
  }

  // ✅ Check product stock
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  if (quantity > product.stock) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.stock} items are available in stock.`,
    });
}

  // Update quantity
  cartItem.quantity = Number(quantity);

  await cart.save();

  // Return populated cart
  const updatedCart = await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "title price images stock category brand",
  });

  // Filter out any null items
  if (updatedCart) {
    updatedCart.items = updatedCart.items.filter(item => item.product !== null);
  }

  res.status(200).json({
    success: true,
    message: "Cart updated successfully.",
    cart: updatedCart,
  });
});

// @desc Remove Product From Cart
// @route DELETE /api/cart/:productId
// @access Private

export const removeCartItem = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if (!productId || productId === 'null' || productId === 'undefined') {
        return res.status(400).json({
            success: false,
            message: "Valid product ID is required."
        });
    }

    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found."
        });
    }

    const productExists = cart.items.some(
        item => item.product && item.product.toString() === productId
    );

    if (!productExists) {
        return res.status(404).json({
            success: false,
            message: "Product not found in cart."
        });
    }

    cart.items = cart.items.filter(
        item => item.product && item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
        path: "items.product",
        select: "title price images stock category brand"
    });

    if (updatedCart) {
        updatedCart.items = updatedCart.items.filter(item => item.product !== null);
    }

    res.status(200).json({
        success: true,
        message: "Product removed from cart.",
        cart: updatedCart
    });

});

// @desc Clear Cart
// @route DELETE /api/cart
// @access Private

export const clearCart = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found."
        });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
        success: true,
        message: "Cart cleared successfully.",
        cart
    });

});