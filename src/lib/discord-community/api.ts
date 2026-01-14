export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function handleAPIRequest<T>(
  handler: () => Promise<T>
): Promise<APIResponse<T>> {
  try {
    const data = await handler();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export function validateAPIKey(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  const apiKey = process.env.WEBAPP_API_KEY || 'dev-key-change-in-production';
  
  if (!authHeader) return false;
  
  const token = authHeader.replace('Bearer ', '');
  return token === apiKey;
}
