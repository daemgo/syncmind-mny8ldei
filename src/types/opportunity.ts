export interface Opportunity {
  id: string
  code: string
  name: string
  customerId: string
  customerName: string
  amount: number
  stage: string
  expectedCloseDate: string
  ownerId: string
  ownerName: string
  note: string
  createdAt: string
  updatedAt: string
}

export interface StageHistory {
  id: string
  opportunityId: string
  stage: string
  enteredAt: string
  note: string
}

export interface OpportunityAttachment {
  id: string
  opportunityId: string
  fileName: string
  fileType: string
  uploadedAt: string
  uploaderName: string
}
