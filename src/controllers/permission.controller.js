const { prisma } = require("../config/db");

const addPermission = async (req, res) => {
  try {
    const { reason } = req.body;

    const requestedById = req.user.id;

    const result = await prisma.permissionRequest.create({
      data: { reason, requestedById, requestedAt: new Date() },
      include: {
        requester: {
          select: { name: true },
        },
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        id: result.id,
        requestedById: result.requestedById,
        name: result.requester.name,
        reason: result.reason,
        status: result.status,
        requestedAt: result.requestedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPermissions = async (req, res) => {
  try {
    const result = await prisma.permissionRequest.findMany({
      include: {
        requester: {
          select: { name: true },
        },
        approver: {
          select: { name: true },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: result.map((r) => ({
        id: r.id,
        requestedById: r.requestedById,
        requesterName: r.requester.name,
        approvedById: r.approvedById,
        approverName: r.approver?.name ?? null,
        status: r.status,
        requestedAt: r.requestedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePermission = async (req, res) => {
  try {
    const { status } = req.body;
    const approvedById = req.user.id;

    const permissionResult = await prisma.permissionRequest.findUnique({
      where: { id: req.params.id },
    });

    if (!permissionResult) return res.status(404).json({ error: "Not found" });

    if (permissionResult.status !== "PENDING")
      return res
        .status(400)
        .json({ error: `Already ${permissionResult.status.toLowerCase()}` });

    // Validate status
    if (!status) {
      return res.status(400).json({
        error: "Status is required",
      });
    }

    const allowedStatus = ["APPROVED", "REJECTED"];

    if (!allowedStatus.includes(status.toUpperCase())) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }

    const result = await prisma.permissionRequest.update({
      where: { id: permissionResult.id },
      data: {
        status: status.toUpperCase(),
        approvedById,
        approvedAt: new Date(),
      },
      include: {
        requester: {
          select: { name: true },
        },
        approver: {
          select: { name: true },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        id: result.id,
        requestedById: result.requestedById,
        requesterName: result.requester.name,
        approvedById: result.approvedById ?? null,
        approverName: result.approver?.name ?? null,
        reason: result.reason,
        status: result.status,
        approvedAt: result.approvedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removePermission = async (req, res) => {
  try {
    const permissionResult = await prisma.permissionRequest.findUnique({
      where: { id: req.params.id },
    });

    if (!permissionResult) return res.status(404).json({ error: "Not found" });

    await prisma.permissionRequest.delete({
      where: { id: permissionResult.id },
    });

    res
      .status(200)
      .json({ status: "success", message: "Permission request removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addPermission,
  getPermissions,
  updatePermission,
  removePermission,
};
