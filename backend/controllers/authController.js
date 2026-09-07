const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")


// =========================
// ADMIN REGISTER
// =========================

const registerAdmin = async (req, res) => {
  try {
    console.log("=================================")
    console.log("ADMIN REGISTER API CALLED")
    console.log("REQUEST BODY:", req.body)
    console.log("=================================")

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      })
    }

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (cleanName.length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters"
      })
    }

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      })
    }

    const existingUser = await User.findOne({
      email: cleanEmail
    })

    if (existingUser) {
      return res.status(400).json({
        message: "Admin with this email already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    )

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "Admin"
    })

    console.log("ADMIN CREATED:", user.email)

    return res.status(201).json({
      message: "Admin registration successful. You can now login.",

      admin: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error("ADMIN REGISTER ERROR:", error)

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Admin with this email already exists"
      })
    }

    return res.status(500).json({
      message: error.message || "Admin registration failed"
    })
  }
}


// =========================
// ADMIN LOGIN
// =========================

const loginAdmin = async (req, res) => {
  try {
    console.log("=================================")
    console.log("ADMIN LOGIN API CALLED")
    console.log("LOGIN EMAIL:", req.body?.email)
    console.log("=================================")

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      })
    }

    const cleanEmail = email.trim().toLowerCase()

    const user = await User.findOne({
      email: cleanEmail
    }).select("+password")

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    if (user.role !== "Admin") {
      return res.status(403).json({
        message: "Access denied. Admin account required."
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: "admin"
      },
      process.env.JWT_SECRET || "svgu_library_management_secret",
      {
        expiresIn: "1d"
      }
    )

    console.log("ADMIN LOGIN SUCCESS:", user.email)

    return res.status(200).json({
      message: "Admin login successful",

      token,

      role: "admin",

      admin: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error)

    return res.status(500).json({
      message: error.message || "Admin login failed"
    })
  }
}


module.exports = {
  registerAdmin,
  loginAdmin
}