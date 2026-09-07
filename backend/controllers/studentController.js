const Student = require("../models/Student")


const getStudents = async (req, res) => {

  try {

    const students =
      await Student.find()
        .sort({ createdAt: -1 })

    res.json(students)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}



const createStudent = async (req, res) => {

  try {

    const student =
      await Student.create(req.body)

    res.status(201).json(student)

  } catch (error) {

    res.status(400).json({
      message: error.message
    })

  }

}



const updateStudent = async (req, res) => {

  try {

    const student =
      await Student.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
          runValidators: true
        }

      )


    if (!student) {

      return res.status(404).json({
        message: "Student not found"
      })

    }


    res.json(student)

  } catch (error) {

    res.status(400).json({
      message: error.message
    })

  }

}



const updateStudentStatus = async (req, res) => {

  try {

    const { status } = req.body


    if (
      status !== "Active" &&
      status !== "Inactive"
    ) {

      return res.status(400).json({
        message:
          "Status must be Active or Inactive"
      })

    }


    const student =
      await Student.findByIdAndUpdate(

        req.params.id,

        { status },

        {
          new: true,
          runValidators: true
        }

      )


    if (!student) {

      return res.status(404).json({
        message: "Student not found"
      })

    }


    res.json({

      message:
        `Student account is now ${status}`,

      student

    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}



const deleteStudent = async (req, res) => {

  try {

    const student =
      await Student.findByIdAndDelete(
        req.params.id
      )


    if (!student) {

      return res.status(404).json({
        message: "Student not found"
      })

    }


    res.json({
      message:
        "Student deleted successfully"
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}



const getStudentCount = async (req, res) => {

  try {

    const count =
      await Student.countDocuments()

    res.json({ count })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}


module.exports = {

  getStudents,
  createStudent,
  updateStudent,
  updateStudentStatus,
  deleteStudent,
  getStudentCount

}