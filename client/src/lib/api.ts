async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
    }

    const url = `${apiUrl}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`API Error: ${response.status} ${response.statusText}`, errorBody);
            try {
                const errorJson = JSON.parse(errorBody);
                throw new Error(errorJson.message || `Request failed with status ${response.status}`);
            } catch {
                throw new Error(`Request failed with status ${response.status}`);
            }
        }

        if (response.status === 204) {
            return undefined as T;
        }

        return response.json() as Promise<T>;

    } catch (error) {
        console.error("Fetch request failed:", error);
        throw error;
    }
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { method: 'GET', ...options }),
    post: <T>(endpoint:string, body: unknown, options?: RequestInit) => apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
    patch: <T>(endpoint: string, body: unknown, options?: RequestInit) => apiFetch<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
    delete: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { method: 'DELETE', ...options }),
    put: <T>(endpoint: string, body: unknown, options?: RequestInit) => apiFetch<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
};
