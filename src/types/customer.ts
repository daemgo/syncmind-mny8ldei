export interface Customer {
  id: string
  code: string
  name: string
  industry: string
  scale: string
  address: string
  website: string
  level: string
  ownerId: string
  ownerName: string
  primaryContact: string
  phone: string
  email: string
  source: string
  pooledAt: string | null
  lastFollowUpAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  customerId: string
  name: string
  title: string
  phone: string
  email: string
  isPrimary: boolean
}

export interface CustomerFollowup {
  id: string
  customerId: string
  occurredAt: string
  type: string
  summary: string
  ownerName: string
}
