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