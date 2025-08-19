import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "689b9591f9f894f5587da550", 
  requiresAuth: true // Ensure authentication is required for all operations
});
