import auditModel from "../../../db/models/audit.model.js";

const logActivity = async ({
  action,
  category = "system",
  performedBy,
  targetType,
  targetId,
  description,
}) => {
  try {
    await auditModel.create({
      action,
      category,
      performedBy,
      targetType,
      targetId,
      description,
    });
  } catch (error) {
    console.error("Failed to write audit log:", error.message);
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const activity = await auditModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("performedBy", "fname lname role")
      .lean();

    res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to load recent activity",
    });
  }
};

const getAllLogs = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [logs, total] = await Promise.all([
      auditModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("performedBy", "fname lname role")
        .lean(),
      auditModel.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to load audit logs",
    });
  }
};

export { logActivity, getRecentActivity, getAllLogs };

