interface IFetchOptions {
    userEmail?: string | null;
}

export async function createApiClient() {
    return {
        get: async (url: string, options: IFetchOptions = {}) => {
            const headers: HeadersInit = {};
            if (options.userEmail) {
                headers["x-user-email"] = options.userEmail;
            }

            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return await response.json();
        },

        post: async (url: string, body: any, options: IFetchOptions = {}) => {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };
            if (options.userEmail) {
                headers["x-user-email"] = options.userEmail;
            }

            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return await response.json();
        },

        patch: async (url: string, body: any, options: IFetchOptions = {}) => {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };
            if (options.userEmail) {
                headers["x-user-email"] = options.userEmail;
            }

            const response = await fetch(url, {
                method: "PATCH",
                headers,
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return await response.json();
        },

        delete: async (url: string, options: IFetchOptions = {}) => {
            const headers: HeadersInit = {};
            if (options.userEmail) {
                headers["x-user-email"] = options.userEmail;
            }

            const response = await fetch(url, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return await response.json();
        },
    };
}
