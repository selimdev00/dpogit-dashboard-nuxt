/**
 * Health check endpoint for Docker container monitoring
 * Returns 200 OK if the service is running properly
 */
export default defineEventHandler(() => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "dpogti-dashboard",
  };
});
