import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.API_URL || "http://localhost:5000";

export async function uploadFileWithAuth(file, metaData = {}) {
  const session = await getSession();

  if (!session) {
    throw new Error("Not Authenticated");
  }

  const formData = new FormData();
  formData.append("file", file);
  Object.entries(metaData).forEach(([key, values]) => {
    formData.append(key, values);
  });

  try {
    const response = await axios.post(`${API_URL}/v1/media/upload`, formData, {
      headers: {
        Authorization: `Bearer ${session.idToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (e) {
    throw new Error("Image Upload Failed");
  }
}
