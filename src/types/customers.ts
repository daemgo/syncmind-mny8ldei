export type CustomerStatus = "potential" | "active" | "inactive" | "churned"
export type CustomerIndustry = "manufacturing" | "automotive" | "electronics" | "machinery" | "energy"

export interface Customer {
  id: string
  code: string
  name: string
  industry: CustomerIndustry
  contact: string
  phone: string
  email: string
  status: CustomerStatus
  stage: string
  revenue: number
  lastFollowup: string
  createdAt: string
  region: string
  employees: number
  description: string
}
