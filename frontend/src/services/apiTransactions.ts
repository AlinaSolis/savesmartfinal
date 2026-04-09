import axios from 'axios'

const apiTransactions = axios.create({
    baseURL: import.meta.env.VITE_TRANSACTIONS_API,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

apiTransactions.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default apiTransactions