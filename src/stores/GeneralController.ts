
// Define a type for the possible keys in the `links` objects
type DocumentModel = 'FormDocuments' | 'ProcedureDocuments';
const baseUrl = `${import.meta.env.VITE_API_URL}`;
export class GeneralController {

    private token: string | null;

    constructor() {
        let storedProfile;
        try {
            const userData = localStorage.getItem('user');
            storedProfile = userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Failed to parse user data from localStorage:', error);
            storedProfile = null;
        }
        this.token = storedProfile || null;
        console.log(this.token)
    }
    private async _fetch(url: string, options: RequestInit): Promise<Response> {
        if (!this.token) {
            console.error("Authentication token not available.");
            throw new Error("Authentication token not available.");
        }

        const headers: HeadersInit = {
            'Authorization': 'Bearer ' + this.token,
            ...options.headers, // Merge any custom headers
        };

        const response = await fetch(url, {
            ...options,
            headers: headers,
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({})); // Try to parse error body if available
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${JSON.stringify(errorBody)}`);
        }

        return response;
    }

    /**
     * Retrieves data via a POST request.
     * @param apiLink The API endpoint URL.
     * @param formData The data to be sent in the request body. Can be a plain object, FormData, etc.
     * @param columnName The name of the column in the response data to return.
     * @returns A Promise that resolves with the data from the specified column, or an empty array on error.
     */
    public async retrieveData<T>(apiLink: string, formData: any, columnName: string): Promise<T[] | any[]> {
        try {
            const options: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Assuming JSON data for general POST                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                },
                body: JSON.stringify(formData), // Convert to JSON string
            };
            const response = await this._fetch(apiLink, options);
            const data = await response.json();
            return data[columnName];
        } catch (error) {
            console.error("Error in retrieveData:", error);
            return [];
        }
    }
    static async retrieveData<T>(apiLink: string, formData: any, columnName: string): Promise<T[] | any[]> {
        try {
            const token = getToken();
            const options: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            };
            const response = await fetch(baseUrl + apiLink, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json(); // <-- Correct way to get JSON data
            return data[columnName];
        } catch (error) {
            console.error("Error in retrieveData:", error);
            return [];
        }
    }
    /**
     * Retrieves data via a GET request.
     * @param apiLink The API endpoint URL.
     * @param columnName The name of the column in the response data to return.
     * @returns A Promise that resolves with the data from the specified column, or an empty array on error.
     */
    public async retrieveGETData<T>(apiLink: string, columnName: string): Promise<T[] | any[]> {
        try {
            const options: RequestInit = {
                method: 'GET',
            };
            const response = await this._fetch(apiLink, options);
            const data = await response.json();
            return data[columnName];
        } catch (error) {
            console.error("Error in retrieveData:", error);
            return [];
        }
    }
    static async retrieveDataGet<T>(apiLink: string, columnName: string): Promise<T[] | any[]> {
        try {
            const token = getToken();
            const options: RequestInit = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await fetch(baseUrl + apiLink, options);
            const data = await response.json();
            return data[columnName];
        } catch (error) {
            console.error("Error in retrieveData:", error);
            return [];
        }
    }
    /**
     * Retrieves a file via a POST request.
     * @param model The document model type (e.g., 'FormDocuments').
     * @param data The data to be sent in the request body.
     * @returns A Promise that resolves with the Blob, or an empty array on error.
     */
    static async retrieveFile(data: any, targetApiLink: string): Promise<Blob> {
        try {
            const token = getToken();
            const fetchOptions: RequestInit = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', // Tell the server we're sending JSON
                },
                body: JSON.stringify(data), // Send the 'link' object as JSON
            };

            const response = await fetch(baseUrl + targetApiLink, fetchOptions);

            // Handle HTTP errors (e.g., 404, 500, 401, 403)
            if (!response.ok) {
                let errorInfo = `HTTP error! Status: ${response.status}`;
                try {
                    const errorJson = await response.json();
                    errorInfo += `, Details: ${JSON.stringify(errorJson)}`;
                } catch (e) {
                    const errorText = await response.text();
                    errorInfo += `, Response: "${errorText.substring(0, 100)}..."`; // Truncate long responses
                }
                throw new Error(errorInfo);
            }

            // If the request was successful, return the response as a Blob (the PDF file)
            return await response.blob();
        } catch (err) {
            console.error("API Call Error in GeneralController.retrieveFile:", err);
            // Re-throw the error so the calling component can handle it
            throw err;
        }
    }
    static async retrieveGetFile(targetApiLink: string): Promise<Blob> {
        try {
            const token = getToken();
            const fetchOptions: RequestInit = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', // Tell the server we're sending JSON
                },// Send the 'link' object as JSON
            };

            const response = await fetch(baseUrl + targetApiLink, fetchOptions);

            // Handle HTTP errors (e.g., 404, 500, 401, 403)
            if (!response.ok) {
                let errorInfo = `HTTP error! Status: ${response.status}`;
                try {
                    const errorJson = await response.json();
                    errorInfo += `, Details: ${JSON.stringify(errorJson)}`;
                } catch (e) {
                    const errorText = await response.text();
                    errorInfo += `, Response: "${errorText.substring(0, 100)}..."`; // Truncate long responses
                }
                throw new Error(errorInfo);
            }

            // If the request was successful, return the response as a Blob (the PDF file)
            return await response.blob();
        } catch (err) {
            console.error("API Call Error in GeneralController.retrieveGetFile:", err);
            // Re-throw the error so the calling component can handle it
            throw err;
        }
    }
    /**
     * Retrieves a file via a POST request (duplicate function name, consider renaming for clarity).
     * @param apiLink The API endpoint URL.
     * @param column The data to be sent in the request body (named 'column' but seems to be data).
     * @returns A Promise that resolves with the Blob, or an empty array on error.
     */
    public async retriveFile(apiLink: string, column: any): Promise<Blob | any[]> {
        try {
            const options: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Assuming JSON data for this endpoint
                },
                body: JSON.stringify(column),
            };
            const response = await this._fetch(apiLink, options);
            return await response.blob(); // Get the response as a Blob
        } catch (error) {
            console.error("Error in retriveFile (second instance):", error);
            return [];
        }
    }

    /**
     * Stores an item via a POST request with multipart/form-data.
     * @param apiLink The API endpoint URL.
     * @param data The data to be sent in the request body (FormData).
     * @returns A Promise that resolves with the Response object.
     */
    static async storeItem(apiLink: string, data: FormData): Promise<Response> {
        const token = getToken();
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: data, // FormData handles 'Content-Type': 'multipart/form-data' automatically
        };
        try {
            return await fetch(baseUrl + apiLink, options);
        } catch (error) {
            console.error("Error in storeItem:", error);
            throw error;
        }
    }
    static async storeJson(apiLink: string, data: FormData): Promise<Response> {
        const token = getToken();
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                "Content-Type": "application/json",
            },
            body: data, // FormData handles 'Content-Type': 'multipart/form-data' automatically
        };
        try {
            return await fetch(baseUrl + apiLink, options);
        } catch (error) {
            console.error("Error in storeItem:", error);
            throw error;
        }
    }
    static async storeItemFiles(apiLink: string, data: FormData): Promise<any> {
        const token = getToken();

        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: data,
        };

        const response = await fetch(baseUrl + apiLink, options);

        // ✅ Handle errors properly
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        // ✅ Always safe now because Laravel returns JSON
        return await response.json();
    }
    /**
     * Removes an item via a POST request with multipart/form-data.
     * @param apiLink The API endpoint URL.
     * @param data The data to be sent in the request body (FormData).
     * @returns A Promise that resolves with the Response object.
     */
    static async removeItem(apiLink: string, data: FormData): Promise<Response> {
        const token = getToken();
        const options: RequestInit = {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        try {
            return await fetch(baseUrl + apiLink, options);
        } catch (error) {
            console.error("Error in removeItem:", error);
            throw error;
        }
    }

    /**
     * Sends a print log request via a POST request with multipart/form-data.
     * @param model The document model type (e.g., 'FormDocuments').
     * @param data The data to be sent in the request body (FormData).
     * @returns A Promise that resolves with the Response object.
     */
    public async printLog(model: DocumentModel, data: FormData): Promise<Response> {
        const links: Record<DocumentModel, string> = {
            FormDocuments: '/forms/form-documents/print',
            ProcedureDocuments: '/procedure/procedure-documents/print'
        };
        const link: string | undefined = links[model];

        if (!link) {
            console.error(`Invalid model provided for printLog: ${model}`);
            throw new Error(`Invalid model: ${model}`);
        }

        const options: RequestInit = {
            method: 'POST',
            body: data,
        };
        try {
            return await this._fetch(link, options);
        } catch (error) {
            console.error("Error in printLog:", error);
            throw error;
        }
    }

    /**
     * Downloads a file via a POST request with multipart/form-data.
     * @param model The document model type (e.g., 'FormDocuments').
     * @param data The data to be sent in the request body (FormData).
     * @returns A Promise that resolves with the Blob.
     */
    public async downloadFile(model: DocumentModel, data: FormData): Promise<Blob> {
        const links: Record<DocumentModel, string> = {
            FormDocuments: '/forms/form-documents/download',
            ProcedureDocuments: '/procedure/procedure-documents/download'
        };
        const link: string | undefined = links[model];

        if (!link) {
            console.error(`Invalid model provided for downloadFile: ${model}`);
            throw new Error(`Invalid model: ${model}`);
        }

        const options: RequestInit = {
            method: 'POST',
            body: data,
        };
        try {
            const response = await this._fetch(link, options);
            return await response.blob(); // Get the response as a Blob
        } catch (error) {
            console.error("Error in downloadFile:", error);
            throw error;
        }
    }

    /**
     * Retrieves analytics data via a POST request.
     * @param model The document model type (e.g., 'FormDocuments').
     * @param data The data to be sent in the request body.
     * @returns A Promise that resolves with the JSON response, or an empty array on error.
     */
    public async retriveAnalytics<T>(model: DocumentModel, data: any): Promise<T | any[]> {
        const links: Record<DocumentModel, string> = {
            FormDocuments: '/forms/form-documents/analytics',
            ProcedureDocuments: '/procedure/procedure-documents/analytics'
        };
        const apiLink: string | undefined = links[model];

        if (!apiLink) {
            console.error(`Invalid model provided for retriveAnalytics: ${model}`);
            return [];
        }

        try {
            const options: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };
            const response = await this._fetch(apiLink, options);
            return await response.json();
        } catch (error) {
            console.error("Error in retriveAnalytics:", error);
            return [];
        }
    }

    /**
     * Gets analytics data for a specific column via a POST request.
     * @param model The document model type (e.g., 'FormDocuments').
     * @param data The data to be sent in the request body.
     * @param column The name of the column in the response data to return.
     * @returns A Promise that resolves with the data from the specified column, or an empty array on error.
     */
    public async getAnalytics<T>(model: DocumentModel, data: any, column: string): Promise<T[] | any[]> {
        const links: Record<DocumentModel, string> = {
            FormDocuments: '/forms/show/analytics',
            ProcedureDocuments: '/procedure/show/analytics'
        };
        const apiLink: string | undefined = links[model];

        if (!apiLink) {
            console.error(`Invalid model provided for getAnalytics: ${model}`);
            return [];
        }

        try {
            const options: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };
            const response = await this._fetch(apiLink, options);
            const responseData = await response.json();
            return responseData[column];
        } catch (error) {
            console.error("Error in getAnalytics:", error);
            return [];
        }
    }
}

function getToken() {
    const userData = localStorage.getItem('user');
    let token = null
    if (userData) {
        let parse = JSON.parse(userData);
        token = parse.token
    }
    return token
}
