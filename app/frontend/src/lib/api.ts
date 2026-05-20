import { createClient } from '@metagptx/web-sdk';

// Create client instance with cookie-based authentication
// Backend uses Django session cookies, so we need withCredentials: true
export const client = createClient({
  withCredentials: true,
});