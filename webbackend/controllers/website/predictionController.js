import axios from "axios";

export const predictHousePrice = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/predict",
      req.body
    );

    if (response.data.success) {
      return res.json(response.data);
    } else {
      return res.status(400).json(response.data);
    }

  } catch (error) {
    console.error("Prediction Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || "ML service unavailable"
    });
  }
};