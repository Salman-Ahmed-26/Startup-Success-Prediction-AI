from fastapi import APIRouter, Request

router = APIRouter()

@router.get('/health')
def health_check(request: Request):
    models = request.app.state.models
    models_loaded = bool(models and 'decision_tree' in models)
    return {
        'status': 'ok',
        'models_loaded': models_loaded
    }
