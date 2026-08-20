import type { ApiResponse } from './request'
import request from './request'
import type { Mail, MailDetail, MailFolder, MailboxType } from '@/types/mail'

export function getMailFolders() {
  return request.get<ApiResponse<MailFolder[]>, MailFolder[]>('/mail/folders')
}

export function getMailMessages(params: { mailbox: MailboxType; folderId?: string }) {
  return request.get<ApiResponse<Mail[]>, Mail[]>('/mail/messages', { params })
}

export function getMailMessage(messageId: string) {
  return request.get<ApiResponse<MailDetail>, MailDetail>(`/mail/messages/${messageId}`)
}
