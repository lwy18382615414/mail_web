export type MailboxType =
  | 'inbox'
  | 'starred'
  | 'drafts'
  | 'sent'
  | 'trash'
  | 'spam'
  | 'custom'
  | 'search'

export type Mail = {
  id: string
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
  new?: boolean
  group?: boolean
  external?: boolean
  attachment?: boolean
}
