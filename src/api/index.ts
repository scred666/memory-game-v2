import { ChromeApi } from '@/api/chrome-api.js'
import MockApi from '@/api/mock-api.js'

export const APP_API = process.env.NODE_ENV === 'development' ? MockApi : ChromeApi
