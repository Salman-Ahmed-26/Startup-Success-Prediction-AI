# STARTUPAI 🚀

> **Tagline:** *"Know your startup's potential before you scale."*

StartupAI is a full-stack, AI-powered startup intelligence and viability analytics platform. It allows founders to input granular operational, financial, team, and market metrics and receive a comprehensive, data-driven diagnostic report powered by four trained machine learning models.

---

## 🌟 Key Features

1. **Success Viability Prediction:**
   - Evaluates multi-dimensional signals using a calibrated **Decision Tree Classifier** with exact feature importance attribution.
   - Outputs predicted success category, success probability, risk probability, and model confidence.
2. **K-Nearest Neighbors Validation:**
   - Uses **k-NN** ($k=21$) with standardized feature scaling to benchmark against nearest historical startup profiles.
3. **12-Month Forward Revenue Projection:**
   - Leverages **Linear Regression** ($R^2 = 96.1\%$) to forecast 12-month Annual Recurring Revenue (ARR) and project growth trajectory.
4. **Startup Business Segmentation:**
   - Unsupervised **K-Means Clustering** categorizes businesses into *Early Stage*, *Growth Stage*, *High Growth*, and *High Risk* archetypes with personalized descriptions and cluster center benchmarks.
5. **Dynamic Health Score (0–100):**
   - Holistically evaluates runway viability, growth velocity, customer retention, capital efficiency, and team experience.
6. **Automated Strengths, Risks & Prioritized Recommendations:**
   - Dynamically generated from the founder's raw financial and unit economics inputs.
7. **Interactive "What-If" Scenario Simulator:**
   - Real-time sliders allowing founders to experiment with growth, burn rate, funding, and revenue adjustments and immediately receive live model recalculations.
8. **Ecosystem Analytics & Model Comparison Dashboard:**
   - Visualizations built with **Recharts** displaying industry benchmarks, model performance matrices, and cluster distributions.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (Modern, light SaaS aesthetic with generous whitespace and clear visual hierarchy)
- **Routing:** React Router v6
- **Charts:** Recharts (Radar, Pie, Bar, Area charts)
- **Icons:** Lucide React
- **API Client:** Axios with centralized services and environment variable configuration (`VITE_API_URL`)

### Backend & Machine Learning
- **API Framework:** FastAPI & Uvicorn
- **Data Engineering:** Pandas, NumPy
- **Machine Learning:** Scikit-Learn (`DecisionTreeClassifier`, `KNeighborsClassifier`, `LinearRegression`, `KMeans`, `ColumnTransformer`, `StandardScaler`, `OneHotEncoder`)
- **Model Serialization:** Joblib

---

## 📁 Project Structure

```
startup-ai/
├── backend/
│   ├── data/
│   │   ├── generate_dataset.py       # 2,000-record realistic synthetic dataset generator
│   │   └── startups.csv              # Generated startup dataset
│   ├── ml/
│   │   ├── preprocess.py             # Feature selection and ColumnTransformer pipeline
│   │   ├── train.py                  # Model training and artifact serialization script
│   │   └── evaluate.py               # Classification, regression, and clustering evaluation metrics
│   ├── models/
│   │   ├── decision_tree.pkl         # Primary classification model
│   │   ├── knn.pkl                   # k-NN classification model
│   │   ├── linear_regression.pkl     # Revenue forecast model
│   │   ├── kmeans.pkl                # Business segmentation model
│   │   ├── preprocessor.pkl          # Fitted ColumnTransformer
│   │   ├── knn_scaler.pkl            # Fitted StandardScaler for k-NN
│   │   ├── scaler.pkl                # Standard scaler
│   │   ├── cluster_info.pkl          # Segment labels & cluster centers
│   │   ├── model_metrics.pkl         # Test evaluation scores
│   │   └── feature_names.pkl         # Mapped feature names
│   ├── routes/
│   │   ├── prediction.py             # /predict, /predict/revenue, /predict/cluster
│   │   ├── analytics.py              # /analytics, /model-info
│   │   ├── health.py                 # /health
│   │   └── __init__.py
│   ├── main.py                       # FastAPI application entrypoint with CORS & startup loaders
│   └── requirements.txt              # Python package dependencies
├── frontend/
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── StartupForm.jsx       # 4-Step multi-step assessment form
│   │   │   ├── ProgressSteps.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── HealthScore.jsx       # Semicircular score gauge
│   │   │   ├── SuccessProbability.jsx
│   │   │   ├── RiskCard.jsx
│   │   │   ├── StrengthsCard.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── RevenueForecast.jsx
│   │   │   ├── StartupSegment.jsx
│   │   │   ├── FeatureImportance.jsx # Decision Tree weight bar chart
│   │   │   ├── ModelComparison.jsx   # Decision Tree vs k-NN radar comparison
│   │   │   ├── ScenarioSimulator.jsx # Real-time What-If simulator
│   │   │   ├── Charts.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── ErrorState.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page with hero & live preview
│   │   │   ├── Analyze.jsx           # Assessment input wizard
│   │   │   ├── Results.jsx           # Full intelligence diagnostic report
│   │   │   ├── Insights.jsx          # Ecosystem analytics dashboard
│   │   │   └── About.jsx             # ML methodology & platform details
│   │   ├── services/
│   │   │   └── api.js                # Centralized Axios API client
│   │   ├── utils/
│   │   │   └── format.js             # INR currency and number formatters
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── notebooks/
│   └── startup_analysis.ipynb        # EDA and machine learning experiment notebook
├── README.md
└── .gitignore
```

---

## ⚡ Quick Start Guide

### 1. Backend Setup & Training

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Retrain models or regenerate dataset
python data/generate_dataset.py
python ml/train.py

# Launch FastAPI Backend Server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at: `http://localhost:8000`  
Swagger API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup & Launch

```powershell
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite Development Server
npm run dev
```

The UI will be available at: `http://localhost:5173`

---

## 🔬 Machine Learning Evaluation Summary

| Model | Algorithm | Primary Objective | Test Score / Metrics |
|---|---|---|---|
| **Model A** | Decision Tree Classifier | Success Probability & Drivers | **81.8% Accuracy**, **88.4% Precision**, **91.2% Recall**, **89.8% F1** |
| **Model B** | k-NN ($k=21$) | Peer Benchmark Ensemble | **87.8% Accuracy**, **87.9% Precision**, **99.7% Recall**, **93.5% F1** |
| **Model C** | Linear Regression | 12-Month ARR Projection | **$R^2 = 96.1\%$**, MAE = ₹54.1L, RMSE = ₹75.5L |
| **Model D** | K-Means ($k=4$) | Unsupervised Segment Archetype | Silhouette Score = 0.12, Clean separation across growth & capital profiles |

---

## 🛡️ License

MIT License. Designed and built with ❤️ for startup founders.
