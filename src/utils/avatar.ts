const AVATAR_COLORS = ['#f6603b', '#afd230', '#3fc1f4', '#8b5cf6', '#3b82f6', '#ff9900']

export function stringHash(string: string): number {
  let hash = 0x811c9dc5

  const bytes = new TextEncoder().encode(string)

  for (const byte of bytes) {
    hash ^= byte
    hash = Math.imul(hash, 0x01000193)
  }

  return hash >>> 0
}

export function getAvatarColor(value: string): string {
  const firstCharacter = Array.from(value.trim())[0] ?? ''

  return AVATAR_COLORS[stringHash(firstCharacter) % AVATAR_COLORS.length]!
}