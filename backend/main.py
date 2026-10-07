from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.prediction import router as prediction_router
from routes.analytics import router as analytics_router
from routes.health import router as health_router
import joblib
import os

app = FastAPI(
    title='StartupAI API',
    version='1.0.0',
    description='AI-Powered Startup Viability, Revenue Forecasting, and Intelligence Engine'
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Load models at startup
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
models = {}

@app.on_event('startup')
def load_models():
    try:
        models['decision_tree'] = joblib.load(os.path.join(MODEL_DIR, 'decision_tree.pkl'))
        models['knn'] = joblib.load(os.path.join(MODEL_DIR, 'knn.pkl'))
        models['linear_regression'] = joblib.load(os.path.join(MODEL_DIR, 'linear_regression.pkl'))
        models['kmeans'] = joblib.load(os.path.join(MODEL_DIR, 'kmeans.pkl'))
        models['preprocessor'] = joblib.load(os.path.join(MODEL_DIR, 'preprocessor.pkl'))
        
        # Load scalers
        if os.path.exists(os.path.join(MODEL_DIR, 'knn_scaler.pkl')):
            models['knn_scaler'] = joblib.load(os.path.join(MODEL_DIR, 'knn_scaler.pkl'))
        if os.path.exists(os.path.join(MODEL_DIR, 'scaler.pkl')):
            models['scaler'] = joblib.load(os.path.join(MODEL_DIR, 'scaler.pkl'))
            
        models['metrics'] = joblib.load(os.path.join(MODEL_DIR, 'model_metrics.pkl'))
        models['cluster_info'] = joblib.load(os.path.join(MODEL_DIR, 'cluster_info.pkl'))
        models['feature_names'] = joblib.load(os.path.join(MODEL_DIR, 'feature_names.pkl'))
        print('All StartupAI machine learning models and scalers loaded successfully!')
    except Exception as e:
        print(f'Error loading models: {e}')

app.state.models = models

# Register routes
app.include_router(prediction_router)
app.include_router(analytics_router)
app.include_router(health_router)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)
