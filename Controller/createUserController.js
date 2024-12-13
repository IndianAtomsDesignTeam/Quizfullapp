const prisma = require("../DB/db.config.js");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (findUser) {
      return res.json({ status: 400, message: "Email Already Taken" });
    }

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    res.json({ status: 200, data: newUser, msg: "User Created." });
  } catch (error) {
    console.error("Error creating user:", error);
    res.json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = { createUser };
