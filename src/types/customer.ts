export interface Customer {
  id: string
  customerName: string
  shortName: string
  level: "A" | "B" | "C"
  industry: string
  registeredCapital: number
  employeeCount: string
  region: string
  address: string
  creditCode: string
  status: "active" | "inactive" | "churned"
  ownerName: string
  ownerId: string
  lastFollowUpAt: string
  createdAt: string
}

export interface Contact {
  id: string
  customerId: string
  name: string
  department: string
  title: string
  mobile: string
  email: string
  importance: "key" | "influence" | "normal"
}

export interface CustomerFollowup {
  id: string
  customerId: string
  occurredAt: string
  type: "visit" | "call" | "meeting" | "email" | "other"
  ownerName: string
  content: string
}
