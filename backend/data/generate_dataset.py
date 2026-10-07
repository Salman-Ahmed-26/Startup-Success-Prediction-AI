import pandas as pd
import numpy as np
import os

def generate_dataset(n_samples=2000, random_seed=42):
    np.random.seed(random_seed)
    
    industries = ['Technology', 'Healthcare', 'Fintech', 'E-commerce', 'EdTech', 'FoodTech', 'SaaS', 'AI/ML', 'CleanTech', 'Logistics']
    locations = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Other']
    
    # 1. Startup Age & Founders
    startup_age = np.random.uniform(0.5, 15, n_samples).round(1)
    industry = np.random.choice(industries, n_samples)
    location = np.random.choice(locations, n_samples)
    founders = np.random.randint(1, 5, n_samples)
    founder_experience = np.random.randint(1, 25, n_samples)
    
    # 2. Employees & Team composition
    base_emp = np.random.exponential(scale=15, size=n_samples) + (startup_age * 4) + (founder_experience * 0.8)
    employees = np.clip(base_emp.astype(int), 2, 450)
    
    tech_ratio = np.random.uniform(0.4, 0.75, n_samples)
    technical_team_size = np.clip((employees * tech_ratio).astype(int), 1, employees)
    business_team_size = np.clip(employees - technical_team_size, 0, 150)
    
    # 3. Funding & Investors
    funding_prob = np.clip(0.3 + (startup_age * 0.04) + (founder_experience * 0.02), 0.2, 0.95)
    has_funding = np.random.rand(n_samples) < funding_prob
    
    funding_rounds = np.where(has_funding, np.clip(np.random.poisson(lam=1.5, size=n_samples) + 1, 1, 6), 0)
    investors = np.where(has_funding, np.clip(funding_rounds * np.random.randint(1, 4, n_samples), 1, 18), 0)
    
    funding_scale = np.where(has_funding, (funding_rounds ** 1.8) * np.random.uniform(5000000, 35000000, n_samples), 0)
    funding = np.clip(funding_scale, 0, 450000000).round(-4)
    
    # 4. Market Size & Customers
    market_size = np.random.uniform(50000000, 80000000000, n_samples).round(-5)
    
    customer_growth = np.random.normal(loc=18, scale=22, size=n_samples)
    customer_growth = np.clip(customer_growth, -10, 100).round(1)
    
    customer_retention = np.random.normal(loc=72, scale=14, size=n_samples)
    customer_retention = np.clip(customer_retention, 20, 98).round(1)
    
    cac = np.random.uniform(150, 25000, n_samples).round(0)
    
    base_customers = (employees * np.random.uniform(40, 250, n_samples)) * (1 + customer_growth / 100)
    customers = np.clip(base_customers.astype(int), 10, 850000)
    
    # 5. Financials
    # Monthly revenue realistic correlation with customers, age, employees, retention
    arpu = np.random.uniform(300, 8000, n_samples)
    monthly_revenue = np.clip((customers * arpu * 0.05) + (employees * 60000) + (funding * 0.005), 15000, 45000000).round(-3)
    
    # Monthly burn rate realistic correlation with employees, marketing, tech team
    salary_burn = employees * np.random.uniform(45000, 95000, n_samples)
    marketing_budget = np.clip(monthly_revenue * np.random.uniform(0.15, 0.45, n_samples) + np.random.uniform(20000, 2000000, n_samples), 10000, 8000000).round(-3)
    other_burn = np.random.uniform(50000, 1500000, n_samples)
    
    monthly_burn_rate = (salary_burn + marketing_budget + other_burn).round(-3)
    
    # 6. Realistic Success Label Determination
    # Success signals:
    # - Strong customer growth (> 20%)
    # - High customer retention (> 75%)
    # - Revenue to burn ratio (> 0.9)
    # - Founder experience (> 5 yrs)
    # - Adequate runway / funding relative to burn
    rev_burn_ratio = monthly_revenue / np.maximum(monthly_burn_rate, 1)
    growth_score = np.clip(customer_growth / 40.0, -0.5, 2.0)
    retention_score = np.clip((customer_retention - 50) / 30.0, -1.0, 1.5)
    exp_score = np.clip(founder_experience / 12.0, 0, 1.5)
    fin_health_score = np.clip((rev_burn_ratio - 0.7) * 1.5, -2.0, 2.5)
    funding_support = np.clip(np.log10(np.maximum(funding, 10000)) / 8.0, 0, 1.2)
    
    success_logit = (
        1.8 * growth_score +
        1.5 * retention_score +
        1.6 * fin_health_score +
        0.7 * exp_score +
        0.6 * funding_support -
        0.8
    )
    
    success_prob = 1.0 / (1.0 + np.exp(-success_logit))
    # Add a slight realistic stochastic element
    success = (np.random.rand(n_samples) < success_prob).astype(int)
    
    # 7. Annual revenue target (future 12 months)
    # Annual revenue strongly correlates with monthly revenue * 12 modulated by customer growth and retention
    annual_revenue_actual = (monthly_revenue * 12) * (1.0 + (customer_growth / 100.0) * 0.45) * (customer_retention / 80.0)
    annual_revenue_actual = np.clip(annual_revenue_actual + np.random.normal(0, monthly_revenue * 0.5, n_samples), 100000, 600000000).round(-3)
    
    df = pd.DataFrame({
        'startup_age': startup_age,
        'industry': industry,
        'location': location,
        'founders': founders,
        'employees': employees,
        'founder_experience': founder_experience,
        'technical_team_size': technical_team_size,
        'business_team_size': business_team_size,
        'funding': funding,
        'investors': investors,
        'funding_rounds': funding_rounds,
        'monthly_revenue': monthly_revenue,
        'monthly_burn_rate': monthly_burn_rate,
        'marketing_budget': marketing_budget,
        'market_size': market_size,
        'customers': customers,
        'customer_growth': customer_growth,
        'customer_retention': customer_retention,
        'customer_acquisition_cost': cac,
        'annual_revenue': annual_revenue_actual,
        'success': success
    })
    
    output_dir = r'c:\startup-ai\backend\data'
    os.makedirs(output_dir, exist_ok=True)
    csv_path = os.path.join(output_dir, 'startups.csv')
    df.to_csv(csv_path, index=False)
    print(f"Generated realistic dataset with {len(df)} records at {csv_path}")
    print(f"Success rate: {df['success'].mean()*100:.1f}%")
    return df

if __name__ == "__main__":
    generate_dataset()
