import axios, {AxiosError} from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-type": "application/json",
    },
    withCredentials: true
})

export const getError = (error: Error | AxiosError): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data.message
    }
    return 'Error'
}
