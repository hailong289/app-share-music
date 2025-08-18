import axios, { type AxiosResponse } from "axios";


const axiosClient = axios.create({
    baseURL: import.meta.env.APP_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to handle requests
axiosClient.interceptors.request.use(
    (config) => {
        // You can add authorization token or other headers here
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle responses
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        return Promise.reject(error);
    }
);

const ApiService = {
    get: async (url: string, params?: any): Promise<AxiosResponse> => {
        return axiosClient.get(url, { params })
    },
    post: async (url: string, data: any): Promise<AxiosResponse> => {
        return axiosClient.post(url, data)
    },
    put: async (url: string, data: any): Promise<AxiosResponse> => {
        return axiosClient.put(url, data)
    },
    patch: async (url: string, data: any): Promise<AxiosResponse> => {
        return axiosClient.patch(url, data)
    },
    delete: async (url: string): Promise<AxiosResponse> => {
        return axiosClient.delete(url)
    }
};

export default ApiService;
