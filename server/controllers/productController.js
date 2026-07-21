import Product from "../models/product.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { uploadImage, deleteImage } from "../utils/cloudinaryHelper.js";

// @desc Get All Products
// @route GET /api/products
// @access Public

export const getProducts = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const query = {};

    // Search
    if (req.query.search) {
        query.title = {
            $regex: req.query.search,
            $options: "i",
        };
    }

    // Category Filter
    if (req.query.category) {
        query.category = req.query.category;
    }

    // Price Filter
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};

        if (req.query.minPrice) {
            query.price.$gte = Number(req.query.minPrice);
        }

        if (req.query.maxPrice) {
            query.price.$lte = Number(req.query.maxPrice);
        }
    }

    // Sorting
    let sort = {};

    switch (req.query.sort) {
        case "price":
            sort.price = 1;
            break;

        case "-price":
            sort.price = -1;
            break;

        case "latest":
            sort.createdAt = -1;
            break;

        default:
            sort.createdAt = -1;
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        count: products.length,
        products,
    });

});

// @desc Get Single Product
// @route GET /api/products/:id
// @access Public

export const getProductById = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    res.status(200).json({
        success: true,
        product,
    });

});

// @desc Add Product
// @route POST /api/products
// @access Private/Admin

export const addProduct = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    price,
    stock,
    category,
    brand,
  } = req.body;

  // Validation
  if (!title || !description || !price || !category) {
    return res.status(400).json({
      success: false,
      message: "Title, description, price and category are required.",
    });
  }

  const existingProduct = await Product.findOne({ title });

  if (existingProduct) {
  return res.status(409).json({
    success: false,
    message: "A product with this title already exists.",
  });
}

    const uploadedImages = [];

try {

    for (let i = 0; i < req.files.length; i++) {

        const result = await uploadImage(

            req.files[i].buffer,

            "ecommerce/products"

        );

        uploadedImages.push({

            url: result.secure_url,

            public_id: result.public_id,

            isPrimary: i === 0

        });

    }

} catch (error) {

    // Cleanup already uploaded images

    for (const image of uploadedImages) {

        await deleteImage(image.public_id);

    }

    throw error;

}
  // Create Product
  const product = await Product.create({
    title,
    description,
    price,
    stock: stock || 0,
    category,
    brand: brand || "",
    images: uploadedImages,
  });

  res.status(201).json({
    success: true,
    message: "Product added successfully.",
    product,
  });


});

// @desc Update Product
// @route PUT /api/products/:id
// @access Private/Admin

export const updateProduct = asyncHandler(async (req, res) => {

    const {
        title,
        description,
        price,
        stock,
        category,
        brand,
        isActive
    } = req.body;

    // Find Product
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    // Only replace images when new files are uploaded
    if (req.files && req.files.length > 0) {
        // Delete old images from Cloudinary
        for (const image of product.images) {
            await deleteImage(image.public_id);
        }

        // Upload new images
        const uploadedImages = [];

        for (let i = 0; i < req.files.length; i++) {
            const result = await uploadImage(
                req.files[i].buffer,
                "ecommerce/products"
            );

            uploadedImages.push({
                url: result.secure_url,
                public_id: result.public_id,
                isPrimary: i === 0,
            });
        }

        product.images = uploadedImages;
    }

    // Update only provided fields
    product.title = title ?? product.title;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.isActive = isActive ?? product.isActive;

    const updatedProduct = await product.save();

    res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        product: updatedProduct,
    });

});

// @desc Delete Product
// @route DELETE /api/products/:id
// @access Private/Admin

export const deleteProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    for(const image of product.images){

    await deleteImage(

        image.public_id

    );

}

await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
    });

});