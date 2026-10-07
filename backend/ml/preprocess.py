import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

def load_data(filepath):
    return pd.read_csv(filepath)

def get_feature_columns():
    categorical_features = ['industry', 'location']
    numerical_features = [
        'startup_age', 'founders', 'employees', 'founder_experience', 
        'technical_team_size', 'business_team_size', 'funding', 'investors', 
        'funding_rounds', 'monthly_revenue', 'monthly_burn_rate', 'marketing_budget', 
        'market_size', 'customers', 'customer_growth', 'customer_retention', 
        'customer_acquisition_cost'
    ]
    return categorical_features, numerical_features

def create_preprocessor():
    categorical_features, numerical_features = get_feature_columns()
    
    # Exclude monthly_revenue from numerical features for revenue prediction model?
    # No, we'll handle this in prepare_data or explicitly in the pipeline.
    # The requirement: "Categorical features: OneHotEncoder(handle_unknown='ignore'), Numerical features: StandardScaler"
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='passthrough'
    )
    return preprocessor

def prepare_data(df):
    categorical_features, numerical_features = get_feature_columns()
    
    # Classification data
    X_cls = df[numerical_features + categorical_features]
    y_cls = df['success']
    
    # Revenue Prediction data
    features_rev = [f for f in numerical_features if f != 'monthly_revenue'] + categorical_features
    X_rev = df[features_rev]
    y_rev = df['monthly_revenue'] * 12
    
    return X_cls, y_cls, X_rev, y_rev
