import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# Load prediction model & feature list
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

model = joblib.load(os.path.join(MODEL_DIR, "final_house_price_model.pkl"))
model_features = joblib.load(os.path.join(MODEL_DIR, "model_features.pkl"))
metadata = joblib.load(os.path.join(MODEL_DIR, "model_metadata.pkl"))

# Load recommendation model & feature list
REC_MODEL_PATH = os.path.join(MODEL_DIR, "knn_recommender.pkl")
REC_PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "recommendation_preprocessor.pkl")

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

        # 1. Prepare DataFrame from MySQL ads
        df_all = pd.DataFrame(all_ads)
        df_all = df_all.fillna(0) 

        # 2. Map columns to match training feature set
        mapping = {
            'land_size': 'perch',
            'area_sqft': 'kitchen_area_sqft',
            'price': 'price_lkr',
            'electricity_type': 'electricity'
        }
        df_all = df_all.rename(columns=mapping)
        df_all['property_age'] = 2026 - df_all['year_built'].astype(int)

        # 3. Transform ALL active ads into the 109-feature space
        # We use the LOADED preprocessor to ensure scaling/encoding is identical to training
        X_active = rec_preprocessor.transform(df_all)

        # 4. Create a TEMPORARY KNN model just for these active ads
        # This prevents the "Out of Bounds" index error
        from sklearn.neighbors import NearestNeighbors
        temp_knn = NearestNeighbors(n_neighbors=min(len(df_all), 6), metric='cosine')
        temp_knn.fit(X_active)

        # 5. Find the index of the target house in the CURRENT df_all
        target_idx_list = df_all.index[df_all['ad_id'] == int(target_ad_id)].tolist()
        if not target_idx_list:
             return jsonify({"success": True, "recommended_ad_ids": []})
        
        target_idx = target_idx_list[0]

        # 6. Find neighbors among the active ads
        distances, indices = temp_knn.kneighbors([X_active[target_idx]])

        # 7. Extract IDs
        indices_list = indices.flatten().tolist()
        if target_idx in indices_list:
            indices_list.remove(target_idx)

        # Now iloc will work because indices match the length of df_all
        recommended_ids = df_all.iloc[indices_list]['ad_id'].tolist()

        return jsonify({
            "success": True, 
            "recommended_ad_ids": [int(i) for i in recommended_ids]
        })

    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(port=8000)