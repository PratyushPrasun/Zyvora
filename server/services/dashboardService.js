import User from "../models/User.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

export const getDashboardData = async () => {

    // ============================================
    // Basic Dashboard Queries (Run in Parallel)
    // ============================================

    const [
        totalUsers,
        totalProducts,
        totalOrders,

        lowStockProducts,
        outOfStockProducts,

        recentOrders,
        recentUsers,

        revenueResult,

        orderStatusStats,

        monthlyRevenue,

        monthlyOrders,

        topSellingProducts,

        todayRevenue,

        monthRevenue

    ] = await Promise.all([

        // Total Users
        User.countDocuments(),

        // Total Products
        Product.countDocuments(),

        // Total Orders
        Order.countDocuments(),

        // Low Stock Products
        Product.countDocuments({
            stock: { $lte: 5, $gt: 0 }
        }),

        // Out Of Stock Products
        Product.countDocuments({
            stock: 0
        }),

        // Recent Orders
        Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        // Recent Users
        User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        // ============================================
        // Total Revenue
        // ============================================

        Order.aggregate([
            {
                $match: {
                    paymentStatus: "Paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]),

        // ============================================
        // Order Status Statistics
        // ============================================

        Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]),

        // ============================================
        // Monthly Revenue
        // ============================================

        Order.aggregate([
            {
                $match: {
                    paymentStatus: "Paid"
                }
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt"
                        },
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    revenue: {
                        $sum: "$totalAmount"
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]),

        // ============================================
        // Monthly Orders
        // ============================================

        Order.aggregate([
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt"
                        },
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    orders: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]),

        // ============================================
        // Top Selling Products
        // ============================================

        Order.aggregate([

            {
                $unwind: "$items"
            },

            {
                $group: {
                    _id: "$items.product",
                    totalSold: {
                        $sum: "$items.quantity"
                    }
                }
            },

            {
                $sort: {
                    totalSold: -1
                }
            },

            {
                $limit: 5
            },

            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },

            {
                $unwind: "$product"
            },

            {
                $project: {

                    _id: 0,

                    productId: "$product._id",

                    title: "$product.title",

                    price: "$product.price",

                    stock: "$product.stock",

                    image: {
                        $arrayElemAt: ["$product.images.url", 0]
                    },

                    totalSold: 1

                }
            }

        ]),

        // ============================================
        // Today's Revenue
        // ============================================

        Order.aggregate([

            {
                $match: {

                    paymentStatus: "Paid",

                    createdAt: {
                        $gte: new Date(
                            new Date().setHours(0, 0, 0, 0)
                        )
                    }

                }
            },

            {
                $group: {

                    _id: null,

                    revenue: {
                        $sum: "$totalAmount"
                    }

                }
            }

        ]),

        // ============================================
        // Current Month Revenue
        // ============================================

        Order.aggregate([

            {

                $match: {

                    paymentStatus: "Paid",

                    createdAt: {

                        $gte: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            1
                        )

                    }

                }

            },

            {

                $group: {

                    _id: null,

                    revenue: {

                        $sum: "$totalAmount"

                    }

                }

            }

        ])

    ]);

    // ============================================
    // Revenue
    // ============================================

    const totalRevenue =
        revenueResult.length > 0
            ? revenueResult[0].totalRevenue
            : 0;

    // ============================================
    // Order Status Mapping
    // ============================================

    const orderStats = {

        Pending: 0,
        Confirmed: 0,
        Packed: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0

    };

    orderStatusStats.forEach((status) => {

        orderStats[status._id] = status.count;

    });

    // ============================================
    // Return Dashboard
    // ============================================

    return {

        summary: {

            totalUsers,

            totalProducts,

            totalOrders,

            totalRevenue

        },

        orders: orderStats,

        inventory: {

            lowStockProducts,

            outOfStockProducts

        },

        sales: {

            todayRevenue:
                todayRevenue.length > 0
                    ? todayRevenue[0].revenue
                    : 0,

            thisMonthRevenue:
                monthRevenue.length > 0
                    ? monthRevenue[0].revenue
                    : 0

        },

        recentOrders,

        recentUsers,

        topSellingProducts,

        monthlyRevenue,

        monthlyOrders

    };

};