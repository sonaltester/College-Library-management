import axios from "axios";

const API_URL = "http://localhost:5000/api/issues";

export const getIssues = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const issueBook = async (issueData) => {
  const response = await axios.post(
    API_URL,
    issueData
  );

  return response.data;
};

export const returnBook = async (issueId) => {
  const response = await axios.put(
    `${API_URL}/${issueId}/return`
  );

  return response.data;
};