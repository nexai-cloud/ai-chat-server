export type NexaiChatMessage = {
  id?: string;
  uid: string;
  userUid: string;
  sessionId: string;
  fromName: string;
  toName: string;
  message: string;
  projectId: string;
  appId: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl: string;
  fromType: string;
  sources?: string[];
  aiMuted?: boolean;
}

export type IoChatMsg = {
  userUid: string;
  projectId: string;
  sessionKey: string;
  message: string;
  fromName: string;
  toName: string;
  sources?: string[];
  aiMuted?: boolean;
  avatarUrl?: string;
  email?: string;
}

export type AiApiResponse = {
  message: NexaiChatMessage,
  sources: string[] 
}
