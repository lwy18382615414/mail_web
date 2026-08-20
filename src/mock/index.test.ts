import { describe, expect, it } from 'vitest'
import { getCurrentUser } from '@/api/account'
import { getMailMessage, getMailMessages } from '@/api/mail'
import request from '@/api/request'

describe('mock API contract', () => {
  it('unwraps successful responses and routes read-only mail data', async () => {
    await expect(getCurrentUser()).resolves.toMatchObject({ username: 'zhouqin' })

    const inbox = await getMailMessages({ mailbox: 'inbox' })
    expect(inbox).toHaveLength(6)
    expect(inbox.every((mail) => mail.mailbox === 'inbox')).toBe(true)

    const drafts = await getMailMessages({ mailbox: 'drafts' })
    expect(drafts).toHaveLength(1)
    expect(drafts[0]?.mailbox).toBe('drafts')

    const detail = await getMailMessage(inbox[0]!.id)
    expect(detail.paragraphs.length).toBeGreaterThan(0)
  })

  it('rejects unknown mock routes with a 404 error', async () => {
    await expect(request.get('/missing')).rejects.toMatchObject({ status: 404 })
  })
})
