import { AiApiResponse, IoChatMsg } from "../types"
import debug from 'debug'

const log = debug('nexai:api.service')

const apiUrl = process.env.API_URL || 'https://nexai.site/api/nexai'


export const sendChatToAi = async (msg: IoChatMsg) => {
  const url = `${apiUrl}/chat`
  log('sendChattoAi', { url, msg })
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fromName: msg.fromName,
      message: msg.message,
      sessionId: msg.sessionKey,
      projectId: msg.projectId
    })
  })
  return  await resp.json() as AiApiResponse
}

export const sendSupportChat = async (msg: IoChatMsg) => {
  log('sendSupportChat', msg)
  const resp = await fetch(`${apiUrl}/chat/support`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userUid: 'support',
      fromName: msg.fromName,
      message: msg.message,
      sessionId: msg.sessionKey,
      projectId: msg.projectId
    })
  })
  return await resp.json()
}