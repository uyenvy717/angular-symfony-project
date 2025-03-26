interface Environment {
  production: boolean;
  apiUrl: string;
  authUrl: string;
  partnerUrls: {
    growth: string;
    solution: string;
    provider: string;
    affiliate: string;
  };
  clientUrl: string;
}

const API_URL = 'http://localhost:8000/api';

export const environment: Environment = {
  production: false,
  apiUrl: API_URL,
  authUrl: `http://localhost:8000/auth`,
  partnerUrls: {
    growth: `${API_URL}/growth_partners`,
    solution: `${API_URL}/solution_partners`,
    provider: `${API_URL}/solution_providers`,
    affiliate: `${API_URL}/affiliate_partners`
  },
  clientUrl: `${API_URL}/clients`,
  userUrl: `${API_URL}/users`,
};