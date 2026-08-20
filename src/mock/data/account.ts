import profileAvatar from '@/assets/mail/mail-image-4.png'
import type { CurrentUser, EnterpriseAccount } from '@/types/account'

export const currentUser: CurrentUser = {
  id: 'user-zhouqin',
  username: 'zhouqin',
  email: 'zhouqin@smartapp.net.cn',
  domain: '@smartapp.net.cn',
  avatar: profileAvatar,
}

export const enterpriseAccounts: EnterpriseAccount[] = [
  {
    id: 'techcorp-main',
    email: 'zhouqin@techcorp.com',
    company: 'tech科技有限公司',
    avatarText: 'Hn',
    avatarColor: '#2563eb',
  },
  {
    id: 'techcorp-secondary',
    email: 'zhouqin@techcorp.com',
    company: 'tech科技有限公司',
    avatarText: 'Hn',
    avatarColor: '#ff9900',
  },
]
