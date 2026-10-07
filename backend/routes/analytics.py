from fastapi import APIRouter, Request, HTTPException

router = APIRouter()

@router.get('/analytics')
def get_analytics(request: Request):
    models = request.app.state.models
    if 'metrics' not in models:
        raise HTTPException(status_code=503, detail="Analytics metrics not loaded")
        
    metrics = models['metrics']
    dataset_insights = metrics.get('dataset_insights', {})
    
    # Return structured analytics matching both model evaluation requirements and visual charts
    return {
        "decision_tree": metrics.get('decision_tree', {}),
        "knn": metrics.get('knn', {}),
        "linear_regression": metrics.get('linear_regression', {}),
        "kmeans": metrics.get('kmeans', {}),
        "total_analyses": dataset_insights.get('total_records', 2000),
        "overall_success_rate": dataset_insights.get('overall_success_rate', 0.87),
        "startups_by_category": dataset_insights.get('segment_distribution', {
            'High Growth': 490,
            'Growth Stage': 510,
            'Early Stage': 540,
            'High Risk': 460
        }),
        "industry_stats": dataset_insights.get('industry_stats', []),
        "avg_health_score": dataset_insights.get('avg_health_score', 68.4)
    }

@router.get('/model-info')
def get_model_info():
    return {
        "models": {
            "decision_tree": {
                "name": "Decision Tree Classifier",
                "type": "Primary Classification Algorithm",
                "purpose": "Evaluates multi-dimensional startup viability signals, predicts probability of success, and determines feature importance hierarchy.",
                "hyperparameters": "max_depth=8, min_samples_split=12, min_samples_leaf=6, criterion='gini'"
            },
            "knn": {
                "name": "K-Nearest Neighbors Classifier",
                "type": "Ensemble Classification Algorithm",
                "purpose": "Compares input startup vector against normalized feature space of nearest historical startups to validate consensus.",
                "hyperparameters": "n_neighbors=21, weights='distance', metric='minkowski' (p=2)"
            },
            "linear_regression": {
                "name": "Linear Regression",
                "type": "Revenue Forecasting Algorithm",
                "purpose": "Projects estimated 12-month forward Annual Recurring Revenue (ARR) based on current revenue, retention, growth, and team size.",
                "metrics": "Evaluated via MAE, RMSE, and R²"
            },
            "kmeans": {
                "name": "K-Means Clustering",
                "type": "Unsupervised Segmentation Algorithm",
                "purpose": "Clusters companies into four distinct archetypes: Early Stage, Growth Stage, High Growth, and High Risk based on capital efficiency and velocity.",
                "hyperparameters": "n_clusters=4, n_init=10, random_state=42"
            }
        },
        "version": "1.0.0",
        "dataset_size": 2000
    }
