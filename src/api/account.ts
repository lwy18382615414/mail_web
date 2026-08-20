import type { ApiResponse } from './request'
import request from './request'
import type { CurrentUser, EnterpriseAccount } from '@/types/account'

export function getCurrentUser() {
  return request.get<ApiResponse<CurrentUser>, CurrentUser>('/user/current')
}

export function getEnterpriseAccounts() {
  return request.get<ApiResponse<EnterpriseAccount[]>, EnterpriseAccount[]>('/enterprises')
}
