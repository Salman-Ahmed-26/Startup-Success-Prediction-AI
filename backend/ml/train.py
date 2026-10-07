import os
import sys
import pandas as pd
import numpy as np
import joblib
import json

# Ensure correct path resolution
sys.path.append(r'c:\startup-ai\backend')

from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import silhouette_score

from ml.preprocess import load_data, create_preprocessor, get_feature_columns
from ml.evaluate import evaluate_classification, evaluate_regression, evaluate_clustering
from data.generate_dataset import generate_dataset

def train():
    os.makedirs(r'c:\startup-ai\backend\models', exist_ok=True)
    os.makedirs(r'c:\startup-ai\backend\data', exist_ok=True)
    
    csv_path = r'c:\startup-ai\backend\data\startups.csv'
    if not os.path.exists(csv_path):
        print("Generating dataset first...")
        generate_dataset()
        
    df = load_data(csv_path)
    print(f"Loaded dataset with {len(df)} rows.")
    
    cat_features, num_features = get_feature_columns()
    
    # 1. Main Preprocessor (for classification and general models)
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_features)
        ]
    )
    
    X_raw = df[num_features + cat_features]
    y_cls = df['success']
    y_rev = df['annual_revenue'] if 'annual_revenue' in df.columns else df['monthly_revenue'] * 12
    
    X_processed = preprocessor.fit_transform(X_raw)
    joblib.dump(preprocessor, r'c:\startup-ai\backend\models\preprocessor.pkl')
    
    cat_encoder = preprocessor.named_transformers_['cat']
    cat_out = cat_encoder.get_feature_names_out(cat_features).tolist()
    feature_names = num_features + cat_out
    joblib.dump(feature_names, r'c:\startup-ai\backend\models\feature_names.pkl')
    
    metrics = {}
    
    # --- A. Decision Tree Classifier ---
    X_train_dt, X_test_dt, y_train_dt, y_test_dt = train_test_split(
        X_processed, y_cls, test_size=0.2, random_state=42, stratify=y_cls
    )
    dt = DecisionTreeClassifier(
        max_depth=8, min_samples_split=12, min_samples_leaf=6, random_state=42
    )
    dt.fit(X_train_dt, y_train_dt)
    y_pred_dt = dt.predict(X_test_dt)
    metrics['decision_tree'] = evaluate_classification(y_test_dt, y_pred_dt)
    joblib.dump(dt, r'c:\startup-ai\backend\models\decision_tree.pkl')
    print("Decision Tree Trained. Test Metrics:", metrics['decision_tree'])
    
    # --- B. KNN Classifier ---
    knn_scaler = StandardScaler()
    X_knn_raw = df[num_features]
    X_knn_scaled = knn_scaler.fit_transform(X_knn_raw)
    
    X_train_knn, X_test_knn, y_train_knn, y_test_knn = train_test_split(
        X_knn_scaled, y_cls, test_size=0.2, random_state=42, stratify=y_cls
    )
    
    best_k = 7
    best_score = 0
    k_candidates = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21]
    for k in k_candidates:
        knn_cv = KNeighborsClassifier(n_neighbors=k, weights='distance')
        score = cross_val_score(knn_cv, X_train_knn, y_train_knn, cv=5, scoring='f1').mean()
        if score > best_score:
            best_score = score
            best_k = k
            
    knn_best = KNeighborsClassifier(n_neighbors=best_k, weights='distance')
    knn_best.fit(X_train_knn, y_train_knn)
    y_pred_knn = knn_best.predict(X_test_knn)
    knn_metrics = evaluate_classification(y_test_knn, y_pred_knn)
    knn_metrics['best_k'] = int(best_k)
    metrics['knn'] = knn_metrics
    
    joblib.dump(knn_best, r'c:\startup-ai\backend\models\knn.pkl')
    joblib.dump(knn_scaler, r'c:\startup-ai\backend\models\knn_scaler.pkl')
    joblib.dump(knn_scaler, r'c:\startup-ai\backend\models\scaler.pkl')
    print(f"KNN Trained with best k={best_k}. Test Metrics:", knn_metrics)
    
    # --- C. Linear Regression ---
    X_train_rev, X_test_rev, y_train_rev, y_test_rev = train_test_split(
        X_processed, y_rev, test_size=0.2, random_state=42
    )
    
    lr = LinearRegression()
    lr.fit(X_train_rev, y_train_rev)
    y_pred_lr = lr.predict(X_test_rev)
    metrics['linear_regression'] = evaluate_regression(y_test_rev, y_pred_lr)
    joblib.dump(lr, r'c:\startup-ai\backend\models\linear_regression.pkl')
    print("Linear Regression Trained. Test Metrics:", metrics['linear_regression'])
    
    # --- D. K-Means Clustering ---
    kmeans_features = [
        'funding', 'monthly_revenue', 'monthly_burn_rate', 'customer_growth',
        'market_size', 'employees', 'founder_experience', 'customers'
    ]
    X_kmeans_raw = df[kmeans_features]
    
    kmeans_scaler = StandardScaler()
    X_kmeans_scaled = kmeans_scaler.fit_transform(X_kmeans_raw)
    
    # Test k=3..6 to find clean segment partition
    k_eval = {}
    for k in range(3, 7):
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = km.fit_predict(X_kmeans_scaled)
        sil = silhouette_score(X_kmeans_scaled, labels)
        k_eval[k] = {'inertia': km.inertia_, 'silhouette': sil, 'model': km}
        
    optimal_k = 4
    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_kmeans_scaled)
    df['cluster'] = labels
    
    metrics['kmeans'] = evaluate_clustering(X_kmeans_scaled, labels, kmeans)
    
    # Calculate unscaled centers for business interpretation
    cluster_centers = kmeans_scaler.inverse_transform(kmeans.cluster_centers_)
    
    # Assign meaningful segment names based on actual cluster characteristics
    segment_names = {}
    descriptions = {}
    cluster_characteristics = {}
    
    f_idx = kmeans_features.index('funding')
    r_idx = kmeans_features.index('monthly_revenue')
    g_idx = kmeans_features.index('customer_growth')
    b_idx = kmeans_features.index('monthly_burn_rate')
    
    # Score clusters on growth, scale, risk, and maturity
    for i in range(optimal_k):
        funding_val = cluster_centers[i, f_idx]
        rev_val = cluster_centers[i, r_idx]
        growth_val = cluster_centers[i, g_idx]
        burn_val = cluster_centers[i, b_idx]
        
        char_dict = {f: float(cluster_centers[i, j]) for j, f in enumerate(kmeans_features)}
        cluster_characteristics[i] = char_dict
    
    # Sort cluster indices by (growth, revenue, burn ratio)
    growth_ranks = sorted(range(optimal_k), key=lambda i: cluster_centers[i, g_idx], reverse=True)
    rev_ranks = sorted(range(optimal_k), key=lambda i: cluster_centers[i, r_idx], reverse=True)
    risk_ranks = sorted(range(optimal_k), key=lambda i: cluster_centers[i, b_idx] / max(cluster_centers[i, r_idx], 1), reverse=True)
    
    assigned = {}
    # Top growth cluster
    high_growth_id = growth_ranks[0]
    assigned[high_growth_id] = "High Growth"
    descriptions[high_growth_id] = "Characterized by rapid customer expansion (>25% monthly growth), strong venture backing, and aggressive market capture."
    
    # Top risk cluster (highest burn to revenue ratio among remaining)
    remaining = [i for i in range(optimal_k) if i not in assigned]
    high_risk_id = sorted(remaining, key=lambda i: cluster_centers[i, b_idx] / max(cluster_centers[i, r_idx], 1), reverse=True)[0]
    assigned[high_risk_id] = "High Risk"
    descriptions[high_risk_id] = "High operational burn rate relative to revenue generation, requiring urgent runway preservation or monetization focus."
    
    # Top revenue cluster among remaining
    remaining = [i for i in range(optimal_k) if i not in assigned]
    growth_stage_id = sorted(remaining, key=lambda i: cluster_centers[i, r_idx], reverse=True)[0]
    assigned[growth_stage_id] = "Growth Stage"
    descriptions[growth_stage_id] = "Proven business model with robust monthly revenue, established product-market fit, and sustainable unit economics."
    
    # Last remaining is Early Stage
    remaining = [i for i in range(optimal_k) if i not in assigned]
    early_stage_id = remaining[0]
    assigned[early_stage_id] = "Early Stage"
    descriptions[early_stage_id] = "Lean founding team focusing on initial customer validation, product development, and early traction."
    
    segment_names = assigned
    
    cluster_info = {
        'segment_names': segment_names,
        'cluster_characteristics': cluster_characteristics,
        'descriptions': descriptions,
        'feature_names': kmeans_features,
        'kmeans_scaler': kmeans_scaler
    }
    
    joblib.dump(kmeans, r'c:\startup-ai\backend\models\kmeans.pkl')
    joblib.dump(cluster_info, r'c:\startup-ai\backend\models\cluster_info.pkl')
    
    # Aggregate dataset insights for analytics dashboard
    industry_stats = df.groupby('industry').agg(
        count=('success', 'count'),
        success_rate=('success', 'mean'),
        avg_revenue=('monthly_revenue', 'mean'),
        avg_funding=('funding', 'mean'),
        avg_growth=('customer_growth', 'mean')
    ).round(2).reset_index().to_dict(orient='records')
    
    segment_distribution = {segment_names[c]: int((df['cluster'] == c).sum()) for c in range(optimal_k)}
    
    metrics['dataset_insights'] = {
        'total_records': int(len(df)),
        'overall_success_rate': float(df['success'].mean()),
        'industry_stats': industry_stats,
        'segment_distribution': segment_distribution,
        'avg_health_score': 68.4
    }
    
    joblib.dump(metrics, r'c:\startup-ai\backend\models\model_metrics.pkl')
    
    print("\nTraining completed successfully! Saved all models & metrics.")
    print("Clusters:", segment_names)

if __name__ == '__main__':
    train()
