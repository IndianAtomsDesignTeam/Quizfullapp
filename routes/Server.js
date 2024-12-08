const { Router } = require("express");
const UserRoutes = require("./userRoutes");

const router = Router();

router.use("/api/user", UserRoutes);