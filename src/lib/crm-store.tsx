import { createContext, useContext, useState, type ReactNode } from "react"
import { customersMock } from "@/mock/customers"
import { followupsMock } from "@/mock/followups"
import type { Customer, CustomerIndustry, CustomerStatus } from "@/types/customers"
import type { Followup, FollowupResult, FollowupStage, FollowupType } from "@/types/followups"

interface CrmStore {
  customers: Customer[]
  followups: Followup[]
  addCustomer: (data: Partial<Customer>) => void
  updateCustomer: (id: string, data: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  addFollowup: (data: Partial<Followup>) => void
  updateFollowup: (id: string, data: Partial<Followup>) => void
  deleteFollowup: (id: string) => void
}

const CrmContext = createContext<CrmStore | null>(null)

export function CrmProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(customersMock)
  const [followups, setFollowups] = useState<Followup[]>(followupsMock)

  function addCustomer(data: Partial<Customer>) {
    const id = String(Date.now())
    const year = new Date().getFullYear()
    const code = `CUS-${year}${String(customers.length + 1).padStart(3, "0")}`
    const now = new Date().toISOString().slice(0, 10)
    const record: Customer = {
      id,
      code,
      createdAt: now,
      name: data.name ?? "",
      industry: (data.industry as CustomerIndustry) ?? "manufacturing",
      contact: data.contact ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      status: (data.status as CustomerStatus) ?? "potential",
      stage: data.stage ?? "",
      revenue: Number(data.revenue) || 0,
      lastFollowup: data.lastFollowup ?? "",
      region: data.region ?? "",
      employees: Number(data.employees) || 0,
      description: data.description ?? "",
    }
    setCustomers((prev) => [...prev, record])
  }

  function updateCustomer(id: string, data: Partial<Customer>) {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...data,
              revenue: data.revenue !== undefined ? Number(data.revenue) : c.revenue,
              employees: data.employees !== undefined ? Number(data.employees) : c.employees,
            }
          : c,
      ),
    )
  }

  function deleteCustomer(id: string) {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  function addFollowup(data: Partial<Followup>) {
    const id = String(Date.now())
    const ym = new Date().toISOString().slice(0, 7).replace("-", "")
    const code = `FUP-${ym}${String(followups.length + 1).padStart(3, "0")}`
    const record: Followup = {
      id,
      code,
      customerId: data.customerId ?? "",
      customerName: data.customerName ?? "",
      type: (data.type as FollowupType) ?? "visit",
      content: data.content ?? "",
      result: (data.result as FollowupResult) ?? "pending",
      stage: (data.stage as FollowupStage) ?? "qualify",
      contact: data.contact ?? "",
      followupAt: data.followupAt ?? new Date().toISOString().slice(0, 10),
      nextDate: data.nextDate ?? null,
      nextAction: data.nextAction ?? null,
      sales: data.sales ?? "",
      amount: Number(data.amount) || 0,
    }
    setFollowups((prev) => [...prev, record])
  }

  function updateFollowup(id: string, data: Partial<Followup>) {
    setFollowups((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              ...data,
              amount: data.amount !== undefined ? Number(data.amount) : f.amount,
              nextDate: data.nextDate !== undefined ? (data.nextDate || null) : f.nextDate,
              nextAction: data.nextAction !== undefined ? (data.nextAction || null) : f.nextAction,
            }
          : f,
      ),
    )
  }

  function deleteFollowup(id: string) {
    setFollowups((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <CrmContext.Provider
      value={{
        customers,
        followups,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addFollowup,
        updateFollowup,
        deleteFollowup,
      }}
    >
      {children}
    </CrmContext.Provider>
  )
}

export function useCrm() {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error("useCrm must be used within CrmProvider")
  return ctx
}
