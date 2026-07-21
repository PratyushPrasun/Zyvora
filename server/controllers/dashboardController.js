import asyncHandler from "../middleware/asyncHandler.js";
import { getDashboardData } from "../services/dashboardService.js";

export const getDashboard = asyncHandler(async (req, res) => {

    const dashboard = await getDashboardData();

    res.status(200).json({

        success: true,

        dashboard

    });

});