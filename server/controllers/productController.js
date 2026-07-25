import Product from "../models/product.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { uploadImage, deleteImage } from "../utils/cloudinaryHelper.js";
import { deleteCache, deleteCacheByPattern, getCache, setCache } from "../services/cacheServices.js";
import { logAdminAction } from "../services/auditService.js";
import { CATEGORIES } from "../constants/categories.js";

// @desc Get All Categories
// @route GET /api/products/categories
// @access Public

export const getCategories = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        categories: CATEGORIES,
    });
});

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

    // Rating Filter
    if (req.query.rating) {
        query.averageRating = { $gte: Number(req.query.rating) };
    }

    // Availability Filter
    if (req.query.availability === "inStock" || req.query.inStock === "true") {
        query.stock = { $gt: 0 };
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

    const cacheKey = `products:${req.originalUrl || JSON.stringify(req.query)}`;

    const cachedProducts = await getCache(cacheKey);

    if (cachedProducts) {
        return res.json(cachedProducts);
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const responseData = {
        success: true,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        count: products.length,
        products,
    };

    await setCache(cacheKey, responseData, 300);

    res.status(200).json(responseData);
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

    await deleteCacheByPattern("products:*");

    await logAdminAction({
        req,
        admin: req.user._id,
        action: "CREATE",
        entityType: "Product",
        entityId: product._id,
        changes: {
            created: true,
        },
    });

    res.status(201).json({
        success: true,
        message: "Product added successfully.",
        product,
    });


});

const getChanges = (original, updates) => {
  const changes = {};
  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined && updates[key] !== original[key]) {
      changes[key] = {
        from: original[key],
        to: updates[key],
      };
    }
  });
  return changes;
};

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
        isActive,
        __v
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found.",
        });
    }

    if (__v !== undefined && __v !== null && __v !== '' && !isNaN(Number(__v))) {
        if (product.__v !== Number(__v)) {
            return res.status(409).json({
                success: false,
                message: "This product was modified by another admin. Please refresh and try again.",
            });
        }
    }

    const oldImages = [...product.images];

    let retainedExistingImages = oldImages;
    if (req.body.existingImages !== undefined) {
        try {
            const parsed = typeof req.body.existingImages === 'string'
                ? JSON.parse(req.body.existingImages)
                : req.body.existingImages;
            if (Array.isArray(parsed)) {
                retainedExistingImages = parsed;
            }
        } catch (e) {
            // keep all if parse fails
        }
    }

    const newUploadedImages = [];

    if (req.files && req.files.length > 0) {
        try {
            for (let i = 0; i < req.files.length; i++) {
                const result = await uploadImage(
                    req.files[i].buffer,
                    "ecommerce/products"
                );

                newUploadedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                    isPrimary: false,
                });
            }
        } catch (error) {
            for (const image of newUploadedImages) {
                await deleteImage(image.public_id);
            }
            throw error;
        }
    }

    const combinedImages = [...retainedExistingImages, ...newUploadedImages];
    if (combinedImages.length > 0) {
        combinedImages.forEach((img, idx) => {
            img.isPrimary = idx === 0;
        });
    }
    product.images = combinedImages;

    const changes = getChanges(product, {
        title,
        description,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        category,
        brand,
        isActive,
    });

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    let updatedProduct;
    const retainedPublicIds = new Set(retainedExistingImages.map(img => img.public_id));
    const imagesToDelete = oldImages.filter(img => img.public_id && !retainedPublicIds.has(img.public_id));

    try {
        updatedProduct = await product.save();
        for (const image of imagesToDelete) {
            await deleteImage(image.public_id);
        }
    } catch (error) {
        if (error.name === "VersionError") {
            return res.status(409).json({
                success: false,
                message: "This product was modified by another admin. Please refresh and try again.",
            });
        }
        throw error;
    }

    await deleteCacheByPattern("products:*");

    await logAdminAction({
        req,
        admin: req.user._id,
        action: "UPDATE",
        entityType: "Product",
        entityId: updatedProduct._id,
        changes,
    });

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

    for (const image of product.images || []) {
        if (image?.public_id) {
            try {
                await deleteImage(image.public_id);
            } catch (err) {
                console.error("Cloudinary image deletion error:", err);
            }
        }
    }

    await product.deleteOne();

    await deleteCacheByPattern("products:*");

    await logAdminAction({
        req,
        admin: req.user._id,
        action: "DELETE",
        entityType: "Product",
        entityId: product._id,
        changes: {
            title: product.title,
        },
    });

    res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
    });

});