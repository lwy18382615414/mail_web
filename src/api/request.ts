import axios, { type AxiosError } from 'axios'
import { mockAdapter } from '@/mock'

export type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const request = axios.create({ baseURL: '/api', timeout: 5000 })

request.interceptors.request.use((config) => {
  config.adapter = mockAdapter
  return config
})

request.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiResponse<unknown>
    if (payload.code !== 1) throw new ApiError(payload.message, payload.code, response.status)
    return payload.data as typeof response
  },
  (error: AxiosError<ApiResponse<unknown>>) =>
    Promise.reject(
      new ApiError(
        error.response?.data.message ?? error.message,
        error.response?.data.code,
        error.response?.status,
      ),
    ),
)

export default request
