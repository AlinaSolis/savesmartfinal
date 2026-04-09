import axios from 'axios'

const apiNotifications = axios.create({
    baseURL: import.meta.env.VITE_NOTIFICATION_API,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

apiNotifications.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default apiNotifications