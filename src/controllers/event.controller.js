const { prisma } = require("../config/db");

const addEvent = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { title, description } = req.body;

    const event = await prisma.event.create({
      include: {
        creator: {
          select: { id: true, name: true },
        },
      },
      data: { title, description, imageUrl, postedBy: req.user.id },
    });

    res.status(201).json({
      status: "success",
      message: "Event added",
      data: {
        id: event.id,
        title: event.title,
        description: event.description,
        image: event.imageUrl,
        postedBy: event.creator.name,
        postedAt: event.postedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: { name: true },
        },
      },
    });

    res.status(200).json(
      events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        image: event.imageUrl,
        postedBy: event.creator.name,
        postedAt: event.postedAt,
      })),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { title, description } = req.body;

    const eventResult = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!eventResult) return res.status(404).json({ error: "Not found" });

    const eventUpdateData = {};
    if (title !== undefined) eventUpdateData.title = title;
    if (description !== undefined) eventUpdateData.description = description;
    if (imageUrl != null) eventUpdateData.imageUrl = imageUrl;

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: eventUpdateData,
    });

    res.status(200).json({
      status: "success",
      data: {
        id: req.params.id,
        title: event.title,
        description: event.description,
        image: event.imageUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeEvent = async (req, res) => {
  try {
    const eventResult = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!eventResult) return res.status(404).json({ error: "Not found" });

    await prisma.event.delete({
      where: { id: eventResult },
    });

    res.status(200).json({ status: "success", message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addEvent, getEvents, updateEvent, removeEvent };
