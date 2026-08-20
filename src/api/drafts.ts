export interface DraftPayload {
  draftId?: string
  to: string
  cc: string
  subject: string
  body: string
  saveMode: 'auto' | 'manual'
  version: number
}

export interface DraftSaveResult {
  draftId: string
  version: number
}

export async function saveDraft(payload: DraftPayload): Promise<DraftSaveResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 450))

  return {
    draftId: payload.draftId ?? `draft-${Date.now()}`,
    version: payload.version,
  }
}
