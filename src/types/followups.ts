export type FollowupType = "visit" | "call" | "meeting" | "email" | "other"
export type FollowupResult = "positive" | "neutral" | "negative" | "pending"
export type FollowupStage = "qualify" | "proposal" | "negotiation" | "closed"

export interface Followup {
  id: string
  code: string
  customerId: string
  customerName: string
  type: FollowupType
  content: string
  result: FollowupResult
  stage: FollowupStage
  contact: string
  followupAt: string
  nextDate: string | null
  nextAction: string | null
  sales: string
  amount: number
}
