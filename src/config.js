// App configuration
export const config = {
  appName: 'Nocturne',
  tagline: 'Sonic Gallery',
  
  // API Configuration
  api: {
    baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 5000,
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  
  // Feature flags
  features: {
    enableRecommendations: true,
    enableSocialSharing: false,
    enableOfflineMode: false,
  },
};

export default config;
