// This function will be our single, reusable fetch helper
async function apiFetch(endpoint: string, options: RequestInit = {}) {
    // Get the base URL from the environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Set default headers, including Content-Type for POST/PATCH
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Construct the full URL
    const url = `${apiUrl}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: defaultHeaders,
            // We can set caching behavior here for all server-side fetches
            cache: 'no-store', 
        });

        if (!response.ok) {
            // If the server response is not OK, throw a detailed error
            const errorBody = await response.text();
            console.error(`API Error: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Request failed with status ${response.status}`);
        }

        // If the response has content, parse it as JSON
        if (response.status !== 204) { // 204 No Content
            return await response.json();
        }

        // Return undefined for 204 No Content responses
        return undefined;

    } catch (error) {
        console.error("Fetch request failed:", error);
        // Re-throw the error to be handled by the caller's try/catch block
        throw error;
    }
}

// Export specific methods for convenience
export const api = {
    get: (endpoint: string, options?: RequestInit) => apiFetch(endpoint, { method: 'GET', ...options }),
    post: (endpoint: string, body: unknown, options?: RequestInit) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
    patch: (endpoint: string, body: unknown, options?: RequestInit) => apiFetch(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
    delete: (endpoint: string, options?: RequestInit) => apiFetch(endpoint, { method: 'DELETE', ...options }),
    put: (endpoint: string, body: unknown, options?: RequestInit) => apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
};