import AuditLog from "../models/auditLog.js";

export const logAdminAction = async ({
  req,
  admin,
  action,
  entityType,
  entityId,
  changes = {},
}) => {
  try {
    await AuditLog.create({
      admin,
      action,
      entityType,
      entityId,
      changes,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  } catch (err) {
    console.error("Audit Log Error:", err.message);
  }
};