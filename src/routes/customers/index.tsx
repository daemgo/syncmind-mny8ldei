import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable, type ColumnConfig } from "@/components/biz/data-table"
import { DataFilter, type FilterField } from "@/components/biz/data-filter"
import { FormDialog, type FormField } from "@/components/biz/form-dialog"
import { customersMock } from "@/mock/customers"
import type { Customer } from "@/types/customers"

export const Route = createFileRoute("/customers/")({
  component: CustomersPage,
})

const columns: ColumnConfig<Customer>[] = [
  { key: "code", label: "编号", type: "mono" },
  { key: "name", label: "客户名称" },
  { key: "industry", label: "行业", type: "badge", dictId: "dict-customer-industry" },
  { key: "contact", label: "联系人" },
  { key: "status", label: "状态", type: "badge", dictId: "dict-customer-status" },
  { key: "stage", label: "商机阶段" },
  { key: "revenue", label: "客户营收", type: "money", align: "right" },
  { key: "lastFollowup", label: "最近跟进", type: "date" },
]

const filterFields: FilterField[] = [
  { key: "name", label: "客户名称", type: "text" },
  { key: "status", label: "客户状态", type: "select", dictId: "dict-customer-status" },
  { key: "industry", label: "所属行业", type: "select", dictId: "dict-customer-industry" },
]

const formFields: FormField[] = [
  { key: "name", label: "客户名称", type: "text", required: true },
  { key: "contact", label: "联系人", type: "text" },
  { key: "phone", label: "联系电话", type: "text" },
  { key: "email", label: "邮箱", type: "text" },
  { key: "industry", label: "行业", type: "select", dictId: "dict-customer-industry" },
  { key: "status", label: "客户状态", type: "select", dictId: "dict-customer-status" },
  { key: "stage", label: "商机阶段", type: "text" },
  { key: "revenue", label: "客户营收", type: "number" },
]

function CustomersPage() {
  const navigate = useNavigate()
  const [data] = useState(customersMock)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Customer | undefined>()
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filtered = data.filter((item) => {
    return Object.entries(filters).every(([key, val]) => {
      if (!val) return true
      const fieldVal = String((item as Record<string, unknown>)[key] ?? "")
      return fieldVal.toLowerCase().includes(val.toLowerCase())
    })
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">客户管理</h1>
          <p className="text-muted-foreground text-sm mt-1">管理所有客户信息与商机状态</p>
        </div>
        <Button onClick={() => { setEditingItem(undefined); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />新建客户
        </Button>
      </div>
      <DataFilter fields={filterFields} values={filters} onChange={setFilters} />
      <DataTable
        columns={columns}
        data={filtered}
        onView={(item) => navigate({ to: "/customers/$id", params: { id: item.id } })}
        onEdit={(item) => { setEditingItem(item); setDialogOpen(true) }}
      />
      <FormDialog
        entityName="客户"
        fields={formFields}
        data={editingItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
