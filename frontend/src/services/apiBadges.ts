import axios from 'axios'

const apiBadges = axios.create({
    baseURL: import.meta.env.VITE_BADGES_API,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

apiBadges.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default apiBadges