import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# Load model & feature list
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

model = joblib.load(os.path.join(MODEL_DIR, "final_house_price_model.pkl"))
model_features = joblib.load(os.path.join(MODEL_DIR, "model_features.pkl"))
metadata = joblib.load(os.path.join(MODEL_DIR, "model_metadata.pkl"))

CURRENT_YEAR = 2026


def prepare_input(data):
    df = pd.DataFrame([data])

    # ---- Ensure numeric types ----
    numeric_columns = [
        "perch", "bedrooms", "bathrooms",
        "kitchen_area_sqft", "parking_spots",
        "floors", "year_built"
    ]

    for col in numeric_columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Boolean to int
    df["has_garden"] = int(data.get("has_garden", 0) or 0)
    df["has_ac"] = int(data.get("has_ac", 0) or 0)

    # ---- Feature Engineering (MUST MATCH TRAINING) ----
    df["house_age"] = CURRENT_YEAR - df["year_built"]
    df["total_rooms"] = df["bedrooms"] + df["bathrooms"]

    df["luxury_score"] = (
        df["has_ac"] +
        df["has_garden"] +
        df["parking_spots"] +
        df["floors"]
    )

    # Prevent division by zero
    df["kitchen_land_ratio"] = df.apply(
        lambda row: row["kitchen_area_sqft"] / row["perch"]
        if row["perch"] != 0 else 0,
        axis=1
    )

    df["is_new_house"] = (df["house_age"] <= 5).astype(int)

    df.drop("year_built", axis=1, inplace=True)

    # ---- One Hot Encoding ----
    df_encoded = pd.get_dummies(
        df,
        columns=["district", "area", "water_supply", "electricity"],
        drop_first=True
    )

    # ---- Add Missing Columns ----
    for col in model_features:
        if col not in df_encoded.columns:
            df_encoded[col] = 0

    # ---- Ensure Correct Order ----
    df_encoded = df_encoded[model_features]

    return df_encoded


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if not request.json:
            return jsonify({"success": False, "error": "No input data provided"}), 400

        data = request.json

        required_fields = [
            "district", "area", "perch", "bedrooms",
            "bathrooms", "kitchen_area_sqft",
            "parking_spots", "water_supply",
            "electricity", "floors", "year_built"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "error": f"Missing field: {field}"
                }), 400

        prepared_data = prepare_input(data)

        log_prediction = model.predict(prepared_data)
        actual_price = np.expm1(log_prediction[0])

        return jsonify({
            "success": True,
            "predicted_price": round(float(actual_price), 2),
            "model_used": metadata.get("model_name", "Unknown")
        })

    except Exception as e:
        print("Prediction Error:", str(e))
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(port=8000)