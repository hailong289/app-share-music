import axios, { type AxiosResponse } from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.APP_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để gắn token vào request
axiosClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error("Error response:", error.response.data);

      // 401 thì clear token
      if (error.response.status === 401) {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  get: async (url: string, params?: any): Promise<AxiosResponse> => {
    return axiosClient.get(url, { params });
  },
  post: async (url: string, data: any): Promise<AxiosResponse> => {
    return axiosClient.post(url, data,{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
  },
  put: async (url: string, data: any): Promise<AxiosResponse> => {
    return axiosClient.put(url, data);
  },
  patch: async (url: string, data: any): Promise<AxiosResponse> => {
    return axiosClient.patch(url, data);
  },
  delete: async (url: string): Promise<AxiosResponse> => {
    return axiosClient.delete(url);
  },
};

export default ApiService;
