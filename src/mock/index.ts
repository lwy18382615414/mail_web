import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { ApiResponse } from '@/api/request'
import type { Mail, MailboxType } from '@/types/mail'
import { currentUser, enterpriseAccounts } from './data/account'
import { mailFolders, mailMessages } from './data/mail'

const MOCK_DELAY = 300

function getMessages(mailbox: MailboxType, folderId?: string) {
  if (mailbox === 'starred') return mailMessages.filter((mail) => mail.starred)
  if (mailbox === 'search') return mailMessages
  if (mailbox === 'custom') {
    return mailMessages.filter(
      (mail) => mail.mailbox === 'custom' && (!folderId || mail.folderId === folderId),
    )
  }
  return mailMessages.filter((mail) => mail.mailbox === mailbox)
}

function toSummary(message: (typeof mailMessages)[number]): Mail {
  const mail = { ...message }
  delete (mail as Partial<typeof message>).paragraphs
  return mail
}

function createResponse<T>(
  config: InternalAxiosRequestConfig,
  data: T,
  status = 200,
): AxiosResponse<ApiResponse<T>> {
  return {
    config,
    data: { code: status < 400 ? 1 : 0, message: status < 400 ? 'success' : 'not found', data },
    headers: new AxiosHeaders(),
    status,
    statusText: status < 400 ? 'OK' : 'Not Found',
  }
}

function rejectRequest(config: InternalAxiosRequestConfig, status: number, message: string): never {
  const response = createResponse(config, null, status)
  response.data.message = message
  throw new AxiosError(message, AxiosError.ERR_BAD_REQUEST, config, undefined, response)
}

function resolveUrl(config: InternalAxiosRequestConfig) {
  const base = config.baseURL?.replace(/\/$/, '') ?? ''
  const path = config.url?.replace(/^\//, '') ?? ''
  const url = new URL(`${base}/${path}`, 'http://mock.local')
  for (const [key, value] of Object.entries(config.params ?? {})) {
    if (value != null) url.searchParams.set(key, String(value))
  }
  return {
    pathname: url.pathname.replace(/^\/api(?=\/|$)/, '') || '/',
    searchParams: url.searchParams,
  }
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))

  if (config.method?.toLowerCase() !== 'get') rejectRequest(config, 405, 'Method not allowed')

  const { pathname, searchParams } = resolveUrl(config)

  if (pathname === '/user/current') return createResponse(config, { ...currentUser })
  if (pathname === '/enterprises') {
    return createResponse(
      config,
      enterpriseAccounts.map((account) => ({ ...account })),
    )
  }
  if (pathname === '/mail/folders') {
    return createResponse(
      config,
      mailFolders.map((folder) => {
        const messages = getMessages(folder.mailbox, folder.id)
        return {
          ...folder,
          totalCount: messages.length,
          unreadCount: messages.filter((mail) => mail.unread).length,
        }
      }),
    )
  }
  if (pathname === '/mail/messages') {
    const mailbox = (searchParams.get('mailbox') ?? 'inbox') as MailboxType
    const folderId = searchParams.get('folderId') ?? undefined
    return createResponse(
      config,
      getMessages(mailbox, folderId).map((mail) => toSummary(mail)),
    )
  }

  const detailMatch = pathname.match(/^\/mail\/messages\/([^/]+)$/)
  if (detailMatch) {
    const message = mailMessages.find((mail) => mail.id === decodeURIComponent(detailMatch[1]!))
    if (!message) rejectRequest(config, 404, 'Mail message not found')
    return createResponse(config, { ...message, paragraphs: [...message.paragraphs] })
  }

  return rejectRequest(config, 404, 'Mock route not found')
}
