import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from sklearn.neighbors import NearestNeighbors

load_dotenv()

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

model = joblib.load(os.path.join(MODEL_DIR, "final_house_price_model.pkl"))
model_features = joblib.load(os.path.join(MODEL_DIR, "model_features.pkl"))
metadata = joblib.load(os.path.join(MODEL_DIR, "model_metadata.pkl"))

REC_MODEL_PATH = os.path.join(MODEL_DIR, "intelliprop_knn_model.pkl")
REC_PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "intelliprop_preprocessor.pkl")

rec_model = joblib.load(REC_MODEL_PATH)
rec_preprocessor = joblib.load(REC_PREPROCESSOR_PATH)

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


@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        json_data = request.json
        target_ad_id = json_data.get("target_id")
        all_ads = json_data.get("all_ads")

        if not all_ads or len(all_ads) < 2:
            return jsonify({"success": True, "recommended_ad_ids": []})

        # 1. Prepare DataFrame
        df_all = pd.DataFrame(all_ads)
        df_all = df_all.fillna(0) 

        # 2. Rename columns to match the training feature set
        mapping = {
            'land_size': 'perch',
            'area_sqft': 'kitchen_area_sqft', 
            'price': 'price_lkr',
            'electricity_type': 'electricity'
        }
        df_all = df_all.rename(columns=mapping)

        # 3. CRITICAL: Add the missing log transformations and features
        # These MUST match the training code exactly
        df_all["log_price"] = np.log1p(df_all["price_lkr"].astype(float))
        df_all["log_perch"] = np.log1p(df_all["perch"].astype(float))
        df_all["house_age"] = CURRENT_YEAR - df_all["year_built"].astype(int)
        
        # Ensure boolean/int features exist
        df_all["has_garden"] = df_all.get("has_garden", 0).astype(int)
        df_all["has_ac"] = df_all.get("has_ac", 0).astype(int)
        df_all["floors"] = df_all.get("floors", 1).astype(int)

        # 4. Transform using the Saved Preprocessor
        # The preprocessor will now find 'log_price' and 'log_perch'
        X_sparse = rec_preprocessor.transform(df_all)

        # 5. Apply Strategic Weighting
        feature_names = rec_preprocessor.get_feature_names_out()
        X_weighted = X_sparse.copy().tolil()

        for i, name in enumerate(feature_names):
            if "log_price" in name: X_weighted[:, i] *= 3.5
            if "district" in name: X_weighted[:, i] *= 3.0
            if "bedrooms" in name: X_weighted[:, i] *= 2.5
            if "bathrooms" in name: X_weighted[:, i] *= 2.0
            if "log_perch" in name: X_weighted[:, i] *= 1.5

        X_weighted = X_weighted.tocsr()

        # 6. Fit KNN Euclidean
        knn_euc = NearestNeighbors(n_neighbors=min(len(df_all), 11), metric="euclidean")
        knn_euc.fit(X_weighted)

        # 7. Find Target Index
        target_idx_list = df_all.index[df_all['ad_id'] == int(target_ad_id)].tolist()
        if not target_idx_list:
             return jsonify({"success": True, "recommended_ad_ids": []})
        
        target_idx = target_idx_list[0]

        # 8. Query Neighbors
        distances, indices = knn_euc.kneighbors(X_weighted[target_idx])

        # 9. Extract IDs
        indices_list = indices.flatten().tolist()
        if target_idx in indices_list:
            indices_list.remove(target_idx)

        recommended_ids = df_all.iloc[indices_list]['ad_id'].tolist()

        return jsonify({
            "success": True, 
            "recommended_ad_ids": [int(i) for i in recommended_ids]
        })

    except Exception as e:
        print(f"REC ERROR: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000)