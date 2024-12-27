const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const Prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      class: studentClass,
      number,
      dream,
      school,
      password,
    } = req.body;

    const user = await Prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { number: number }],
      },
    });

    if (user) {
      return res.status(409).json({
        message: "User Already Exists",
        success: false,
      });
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user
    const newUser = await Prisma.user.create({
      data: {
        name,
        email,
        class: studentClass, // Use 'studentClass' if 'class' is reserved
        number,
        dream,
        school,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User registered successfully!",
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "Error while saving Data",
      success: false,
      error: error.message, // Include the error message for debugging
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Email:", email, "Password:", password);

    // Fetch user
    const user = await prisma.user.findFirst({
      where: { email: email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true, // Include password for comparison
      },
    });
    console.log("Fetched User:", user);

    const errorMsg = "Login Failed! Password or Email is Wrong";
    if (!user) {
      return res.status(401).json({
        message: errorMsg,
        success: false,
      });
    }

    // Compare password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json({
        message: errorMsg,
        success: false,
      });
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { email: user.email, _id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );
    console.log("JWT Token:", jwtToken);

    // Send success response
    res.status(200).json({
      message: "Login Successful",
      success: true,
      jwtToken,
      email: user.email,
      name: user.name,
    });
  } catch (error) {}
};

module.exports = {
  signup,
  login,
};
