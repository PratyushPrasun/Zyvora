import asyncHandler from "../middleware/asyncHandler.js";
import AuditLog from "../models/auditLog.js";

// @desc Get Audit Logs
// @route GET /api/admin/audit-logs
// @access Private/Admin
export const getAuditLogs = asyncHandler(async (req, res) => {
  const { search, action, entityType, page = 1, limit = 20 } = req.query;

  const query = {};

  if (action) {
    query.action = action;
  }

  if (entityType) {
    query.entityType = entityType;
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [
      { action: searchRegex },
      { entityType: searchRegex },
      { ip: searchRegex },
    ];
  }

  const total = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .populate("admin", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    logs,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  });
});
