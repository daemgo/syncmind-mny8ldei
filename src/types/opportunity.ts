export interface Opportunity {
  id: string
  code: string
  opportunityName: string
  customerId: string
  customerName: string
  amount: number
  stage: string
  status: "open" | "won" | "lost" | "cancelled"
  expectedCloseDate: string
  ownerName: string
  ownerId: string
  productLine: string[]
  remark: string
  createdAt: string
  updatedAt: string
}

export interface StageHistory {
  id: string
  opportunityId: string
  occurredAt: string
  operatorName: string
  fromStage: string
  toStage: string
  remark: string
}

export interface OpportunityFollowup {
  id: string
  opportunityId: string
  occurredAt: string
  type: string
  ownerName: string
  content: string
}

export interface OpportunityTask {
  id: string
  opportunityId: string
  taskName: string
  assigneeName: string
  deadline: string
  status: string
}
