export type MailboxType =
  'inbox' | 'starred' | 'drafts' | 'sent' | 'trash' | 'spam' | 'custom' | 'search'

export type Mail = {
  id: string
  mailbox: Exclude<MailboxType, 'starred' | 'search'>
  folderId?: string
  sender: string
  initials: string
  subject: string
  preview: string
  time: string
  color: string
  email: string
  recipient: string
  date: string
  unread?: boolean
  starred?: boolean
  new?: boolean
  group?: boolean
  external?: boolean
  attachment?: boolean
}

export type MailDetail = Mail & {
  paragraphs: string[]
}

export type MailFolder = {
  id: string
  mailbox: Exclude<MailboxType, 'search'>
  totalCount: number
  unreadCount: number
  parentId?: string
}
