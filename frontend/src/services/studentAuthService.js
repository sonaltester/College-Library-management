import axios from "axios"

const API_URL =
  "http://localhost:5000/api/student-auth"


export const studentRegister = async (studentData) => {

  const response = await axios.post(
    `${API_URL}/register`,
    studentData
  )

  return response.data
}


export const studentLogin = async (loginData) => {

  const response = await axios.post(
    `${API_URL}/login`,
    loginData
  )

  return response.data
}