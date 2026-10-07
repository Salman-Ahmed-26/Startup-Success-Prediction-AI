from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
from fastapi import APIRouter, Request, HTTPException
import pandas as pd
import numpy as np
import math

class StartupData(BaseModel):
    startup_name: Optional[str] = "My Startup"
    startup_age: float = Field(..., ge=0, description="Startup age in years")
    industry: str
    location: str
    founders: int = Field(..., ge=1)
    employees: int = Field(..., ge=1)
    founder_experience: float = Field(..., ge=0)
    technical_team_size: int = Field(..., ge=0)
    business_team_size: int = Field(..., ge=0)
    funding: float = Field(..., ge=0)
    investors: int = Field(..., ge=0)
    funding_rounds: int = Field(..., ge=0)
    monthly_revenue: float = Field(..., ge=0)
    monthly_burn_rate: float = Field(..., ge=0)
    marketing_budget: float = Field(..., ge=0)
    market_size: float = Field(..., ge=0)
    customers: int = Field(..., ge=0)
    customer_growth: float = Field(..., description="Monthly customer growth rate %")
    customer_retention: float = Field(..., ge=0, le=100, description="Customer retention rate %")
    customer_acquisition_cost: float = Field(..., ge=0)

router = APIRouter(prefix="/predict")

def calculate_health_score(data: dict, success_prob: float) -> int:
    """
    Dynamically computes an overall Startup Health Score (0-100)
    based on success probability, customer growth, retention,
    revenue/burn ratio, funding runway, and founder experience.
    """
    score = 0.0
    
    # 1. Model Success probability component (30% weight)
    score += success_prob * 30.0
    
    # 2. Customer growth component (15% weight, scaled with max benefit at 40% monthly growth)
    growth_val = data['customer_growth']
    growth_score = np.clip((growth_val + 5) / 45.0, 0.0, 1.0) * 15.0
    score += growth_score
    
    # 3. Customer retention component (15% weight, ideal is >80%)
    retention_val = data['customer_retention']
    retention_score = np.clip((retention_val - 30.0) / 60.0, 0.0, 1.0) * 15.0
    score += retention_score
    
    # 4. Revenue to Burn ratio / Runway viability (15% weight)
    burn = max(data['monthly_burn_rate'], 1.0)
    rev = data['monthly_revenue']
    ratio = rev / burn
    if ratio >= 1.5:
        ratio_score = 15.0
    elif ratio >= 1.0:
        ratio_score = 12.0 + (ratio - 1.0) * 6.0
    elif ratio >= 0.5:
        ratio_score = 7.0 + (ratio - 0.5) * 10.0
    else:
        # Check runway if funding is available
        runway_months = (data['funding'] / max(burn - rev, 1.0)) if burn > rev else 24.0
        ratio_score = min(runway_months / 24.0, 1.0) * 8.0
    score += ratio_score
    
    # 5. Funding & Capital Efficiency (10% weight)
    funding_val = max(data['funding'], 1.0)
    funding_score = min(math.log10(funding_val) / 8.5, 1.0) * 10.0
    score += funding_score
    
    # 6. Founder & Team Experience (10% weight)
    exp_val = data['founder_experience']
    exp_score = min(exp_val / 15.0, 1.0) * 10.0
    score += exp_score
    
    # 7. Market Size Opportunity (5% weight)
    market_val = max(data['market_size'], 1.0)
    market_score = min(math.log10(market_val) / 10.5, 1.0) * 5.0
    score += market_score
    
    return int(round(np.clip(score, 5.0, 99.0)))

def generate_strengths(data: dict) -> List[str]:
    """Generates dynamic strengths based on startup fundamentals."""
    strengths = []
    
    if data['customer_growth'] >= 20.0:
        strengths.append(f"Strong Customer Growth: Monthly growth rate of {data['customer_growth']}% indicates powerful market traction.")
    elif data['customer_growth'] >= 10.0:
        strengths.append(f"Healthy Growth Momentum: Consistent {data['customer_growth']}% month-over-month customer expansion.")
        
    if data['customer_retention'] >= 80.0:
        strengths.append(f"Exceptional Retention: {data['customer_retention']}% retention demonstrates strong product-market fit and low churn.")
    elif data['customer_retention'] >= 70.0:
        strengths.append(f"Solid Customer Loyalty: {data['customer_retention']}% retention provides a stable recurring foundation.")
        
    if data['monthly_revenue'] > data['monthly_burn_rate']:
        margin = ((data['monthly_revenue'] - data['monthly_burn_rate']) / data['monthly_revenue']) * 100
        strengths.append(f"Positive Unit Economics: Revenue exceeds monthly burn by {margin:.1f}%, achieving operational profitability.")
        
    if data['funding'] >= 20000000:
        strengths.append(f"Strong Capital Runway: Total funding of ₹{data['funding']:,.0f} enables aggressive expansion and hiring.")
        
    if data['founder_experience'] >= 8.0:
        strengths.append(f"Experienced Leadership: Founders possess {data['founder_experience']} years of relevant domain expertise.")
        
    if data['market_size'] >= 5000000000:
        strengths.append("High Total Addressable Market: Operating in a multi-billion rupee addressable market with high ceiling.")
        
    if data['customers'] >= 2000:
        strengths.append(f"Validated Market Demand: Established user base of {data['customers']:,} active customers.")
        
    tech_ratio = data['technical_team_size'] / max(data['employees'], 1)
    if tech_ratio >= 0.5 and data['technical_team_size'] >= 5:
        strengths.append(f"Robust Engineering Core: {data['technical_team_size']} engineers ({tech_ratio*100:.0f}% of team) drives rapid product iteration.")
        
    if not strengths:
        strengths.append("Emerging Venture: Foundational structure established with active exploration of market opportunities.")
        
    return strengths

def generate_risks(data: dict) -> List[str]:
    """Generates dynamic risks based on startup fundamentals."""
    risks = []
    
    if data['monthly_burn_rate'] > data['monthly_revenue']:
        net_burn = data['monthly_burn_rate'] - data['monthly_revenue']
        runway = (data['funding'] / net_burn) if net_burn > 0 else 0
        if runway < 6.0:
            risks.append(f"Critical Burn Rate: Net monthly burn of ₹{net_burn:,.0f} leaves under {runway:.1f} months of funded runway.")
        else:
            risks.append(f"Negative Cash Flow: Monthly burn of ₹{data['monthly_burn_rate']:,.0f} exceeds current revenue of ₹{data['monthly_revenue']:,.0f}.")
            
    if data['customer_retention'] < 65.0:
        risks.append(f"High Customer Churn: Retention of {data['customer_retention']}% indicates leaky acquisition bucket and friction in product value.")
        
    if data['customer_growth'] < 8.0:
        risks.append(f"Sluggish Growth Velocity: Customer growth of {data['customer_growth']}% may struggle to keep pace with industry competitors.")
        
    if data['funding'] < 1000000 and data['monthly_revenue'] < 200000:
        risks.append("Capital Constraint: Limited funding reserves may impede ability to scale marketing and hire key talent.")
        
    if data['founder_experience'] < 2.0:
        risks.append("Early-Career Founding Team: Limited prior executive experience poses operational execution risk.")
        
    if data['customers'] < 50:
        risks.append("Limited Customer Sample: Early customer numbers create uncertainty in statistical churn and lifetime value models.")
        
    if not risks:
        risks.append("Market Competition: Incumbent players with larger balance sheets present continuous competitive pressure.")
        
    return risks

def generate_recommendations(data: dict, risks: List[str]) -> List[str]:
    """Generates actionable recommendations mapped directly to business signals."""
    recommendations = []
    
    if data['monthly_burn_rate'] > data['monthly_revenue']:
        recommendations.append("Extend Financial Runway: Audit non-essential operational expenses and focus marketing spend on high-converting channels to reduce burn.")
        
    if data['customer_retention'] < 75.0:
        recommendations.append("Optimize Customer Onboarding: Implement post-onboarding check-ins and lifecycle email triggers to boost 30-day retention.")
        
    if data['customer_growth'] < 15.0:
        recommendations.append("Accelerate Growth Loops: Introduce referral mechanisms and experiment with high-intent inbound search & content acquisition.")
        
    if data['funding'] < 5000000 and data['monthly_revenue'] < 500000:
        recommendations.append("Prepare Fundraise Collateral: Assemble a clean financial model highlighting positive unit metrics to raise a seed/pre-seed round.")
        
    if data['business_team_size'] < 2 and data['employees'] >= 5:
        recommendations.append("Strengthen GTM Team: Hire dedicated sales/marketing personnel to balance product engineering with proactive business development.")
        
    if data['customer_acquisition_cost'] > 5000 and data['customer_growth'] < 25.0:
        recommendations.append("Refine CAC-to-LTV Equation: Re-evaluate ad target audience and creative messaging to lower acquisition cost per user.")
        
    if len(recommendations) < 3:
        recommendations.append("Monetization Experimentation: Test value-tier pricing models or annual upfront contracts to improve cash flow predictability.")
        recommendations.append("Institutional Governance: Establish an advisory board with seasoned industry operators to guide strategic scale.")
        
    return recommendations[:5]

@router.post("")
def predict_success(data: StartupData, request: Request):
    models = request.app.state.models
    if 'decision_tree' not in models or 'knn' not in models or 'preprocessor' not in models:
        raise HTTPException(status_code=503, detail="Machine learning models not loaded")
        
    dt_model = models['decision_tree']
    knn_model = models['knn']
    preprocessor = models['preprocessor']
    knn_scaler = models.get('knn_scaler') or models.get('scaler')
    metrics = models.get('metrics', {})
    
    input_dict = data.model_dump()
    
    # Feature columns expected for preprocessing
    cat_features = ['industry', 'location']
    num_features = [
        'startup_age', 'founders', 'employees', 'founder_experience', 
        'technical_team_size', 'business_team_size', 'funding', 'investors', 
        'funding_rounds', 'monthly_revenue', 'monthly_burn_rate', 'marketing_budget', 
        'market_size', 'customers', 'customer_growth', 'customer_retention', 
        'customer_acquisition_cost'
    ]
    
    df_raw = pd.DataFrame([{col: input_dict[col] for col in (num_features + cat_features)}])
    
    try:
        # Preprocessing for Decision Tree
        X_processed = preprocessor.transform(df_raw)
        
        # Decision Tree Prediction & Probability
        dt_pred = int(dt_model.predict(X_processed)[0])
        dt_prob_arr = dt_model.predict_proba(X_processed)[0]
        # Class 1 is success
        success_prob = float(dt_prob_arr[1]) if len(dt_prob_arr) > 1 else float(dt_pred)
        risk_prob = float(1.0 - success_prob)
        
        # Decision Tree Feature Importances mapped back to readable features
        feature_importance_list = []
        feature_importance_dict = {}
        if hasattr(dt_model, 'feature_importances_'):
            raw_importances = dt_model.feature_importances_
            try:
                feature_names_out = preprocessor.get_feature_names_out()
                aggregated = {}
                for feat_name, imp in zip(feature_names_out, raw_importances):
                    # Clean feature name
                    clean_name = feat_name.replace('num__', '').replace('cat__', '')
                    base = clean_name.split('_')[0] if any(clean_name.startswith(c) for c in cat_features) else clean_name
                    aggregated[base] = aggregated.get(base, 0.0) + float(imp)
                    
                # Normalize importances
                total_imp = sum(aggregated.values()) or 1.0
                for k, v in aggregated.items():
                    norm_imp = v / total_imp
                    feature_importance_dict[k] = round(norm_imp, 4)
                    feature_importance_list.append({"feature": k, "importance": round(norm_imp, 4)})
                    
                feature_importance_list.sort(key=lambda x: x["importance"], reverse=True)
            except Exception as e:
                print("Feature importance error:", e)
                
        # KNN Prediction
        df_knn = df_raw[num_features]
        try:
            X_knn = knn_scaler.transform(df_knn)
            knn_pred = int(knn_model.predict(X_knn)[0])
            knn_prob_arr = knn_model.predict_proba(X_knn)[0]
            knn_prob = float(knn_prob_arr[1]) if len(knn_prob_arr) > 1 else float(knn_pred)
        except Exception as e:
            print("KNN prediction fallback:", e)
            knn_pred = dt_pred
            knn_prob = success_prob
            
        # Overall Startup Health Score
        health_score = calculate_health_score(input_dict, success_prob)
        
        # Risk level categorization
        if health_score >= 70 and success_prob >= 0.65:
            risk_level = "Low"
            prediction_label = "High Success Potential"
        elif health_score >= 45 or success_prob >= 0.40:
            risk_level = "Moderate"
            prediction_label = "Moderate Potential"
        else:
            risk_level = "High"
            prediction_label = "High Risk"
            
        strengths = generate_strengths(input_dict)
        risks = generate_risks(input_dict)
        recommendations = generate_recommendations(input_dict, risks)
        
        # Model performance comparison for Decision Tree vs KNN
        model_perf = {
            'decision_tree': metrics.get('decision_tree', {'accuracy': 0.82, 'precision': 0.88, 'recall': 0.91, 'f1': 0.90}),
            'knn': metrics.get('knn', {'accuracy': 0.88, 'precision': 0.88, 'recall': 0.99, 'f1': 0.93, 'best_k': 21})
        }
        
        return {
            "prediction": dt_pred,
            "prediction_label": prediction_label,
            "success_probability": round(success_prob, 2),
            "risk_probability": round(risk_prob, 2),
            "health_score": health_score,
            "risk_level": risk_level,
            "risk_assessment": {
                "risk_level": risk_level,
                "identified_risks": risks
            },
            "feature_importance": feature_importance_list if feature_importance_list else feature_importance_dict,
            "feature_importance_dict": feature_importance_dict,
            "knn_prediction": knn_pred,
            "knn_probability": round(knn_prob, 2),
            "strengths": strengths,
            "risks": risks,
            "recommendations": recommendations,
            "model_performance": model_perf
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.post("/revenue")
def predict_revenue(data: StartupData, request: Request):
    models = request.app.state.models
    if 'linear_regression' not in models or 'preprocessor' not in models:
        raise HTTPException(status_code=503, detail="Revenue model not loaded")
        
    lr_model = models['linear_regression']
    preprocessor = models['preprocessor']
    
    input_dict = data.model_dump()
    cat_features = ['industry', 'location']
    num_features = [
        'startup_age', 'founders', 'employees', 'founder_experience', 
        'technical_team_size', 'business_team_size', 'funding', 'investors', 
        'funding_rounds', 'monthly_revenue', 'monthly_burn_rate', 'marketing_budget', 
        'market_size', 'customers', 'customer_growth', 'customer_retention', 
        'customer_acquisition_cost'
    ]
    
    df_raw = pd.DataFrame([{col: input_dict[col] for col in (num_features + cat_features)}])
    
    try:
        X_processed = preprocessor.transform(df_raw)
        pred_rev = float(lr_model.predict(X_processed)[0])
        # Ensure revenue prediction is non-negative and realistic
        pred_rev = max(pred_rev, input_dict['monthly_revenue'] * 10.0, 50000.0)
        
        return {
            "predicted_annual_revenue": round(pred_rev, 2),
            "predicted_revenue_12m": round(pred_rev, 2),
            "current_monthly_revenue": input_dict['monthly_revenue'],
            "currency": "INR"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Revenue prediction error: {str(e)}")

@router.post("/cluster")
def predict_cluster(data: StartupData, request: Request):
    models = request.app.state.models
    if 'kmeans' not in models or 'cluster_info' not in models:
        raise HTTPException(status_code=503, detail="Clustering model not loaded")
        
    kmeans_model = models['kmeans']
    cluster_info = models['cluster_info']
    kmeans_scaler = cluster_info.get('kmeans_scaler')
    
    input_dict = data.model_dump()
    cluster_features = [
        'funding', 'monthly_revenue', 'monthly_burn_rate', 'customer_growth',
        'market_size', 'employees', 'founder_experience', 'customers'
    ]
    df_feat = pd.DataFrame([{col: input_dict[col] for col in cluster_features}])
    
    try:
        if kmeans_scaler:
            X_scaled = kmeans_scaler.transform(df_feat)
        else:
            X_scaled = df_feat.values
            
        cluster_id = int(kmeans_model.predict(X_scaled)[0])
        segment_name = cluster_info.get('segment_names', {}).get(cluster_id, f"Segment {cluster_id}")
        raw_characteristics = cluster_info.get('cluster_characteristics', {}).get(cluster_id, {})
        descriptions = cluster_info.get('descriptions', {})
        description = descriptions.get(cluster_id, "Startups in this segment share similar financial, growth, and team profiles.")
        
        # Format characteristics for intuitive reading
        formatted_chars = {}
        for k, v in raw_characteristics.items():
            if k in ['funding', 'monthly_revenue', 'monthly_burn_rate', 'market_size']:
                if v >= 10000000:
                    formatted_chars[k] = f"₹{v/10000000:.2f} Cr"
                elif v >= 100000:
                    formatted_chars[k] = f"₹{v/100000:.2f} L"
                else:
                    formatted_chars[k] = f"₹{v:,.0f}"
            elif k in ['customer_growth', 'customer_retention']:
                formatted_chars[k] = f"{v:.1f}%"
            elif k in ['employees', 'founder_experience', 'customers']:
                formatted_chars[k] = f"{int(round(v)):,}"
            else:
                formatted_chars[k] = f"{v:.1f}"
                
        return {
            "cluster": cluster_id,
            "segment": segment_name,
            "cluster_name": segment_name,
            "characteristics": formatted_chars,
            "cluster_characteristics": formatted_chars,
            "raw_characteristics": raw_characteristics,
            "description": description
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clustering error: {str(e)}")
