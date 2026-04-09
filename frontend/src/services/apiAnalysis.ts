import axios from 'axios'

const apiAnalysis = axios.create({
    baseURL: import.meta.env.VITE_ANALYSIS_API,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

apiAnalysis.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default apiAnalysis