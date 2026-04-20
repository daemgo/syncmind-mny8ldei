export interface Order {
  id: string
  orderNo: string
  customerId: string
  customerName: string
  opportunityId?: string
  opportunityName?: string
  amount: number
  status: string
  signedAt: string
  expectedDeliveryDate: string
  actualDeliveryDate?: string
  equipmentType: string
  techSpecs: string
  customRequirements: string
  acceptanceCriteria: string
  ownerName: string
  createdAt: string
  updatedAt: string
}
