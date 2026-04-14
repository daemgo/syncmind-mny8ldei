import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable, type ColumnConfig } from "@/components/biz/data-table"
import { DataFilter, type FilterField } from "@/components/biz/data-filter"
import { FormDialog, type FormField } from "@/components/biz/form-dialog"
import { customerMock } from "@/mock/customer"
import type { Customer } from "@/types/customer"

export const Route = createFileRoute("/customers/")({
  component: CustomersPage,
})

const columns: ColumnConfig<Customer>[] = [
  { key: "customerName", label: "客户名称" },
  { key: "level", label: "客户级别", type: "badge", dictId: "dict-customer-level" },
  { key: "industry", label: "所在行业" },
  { key: "ownerName", label: "归属销售" },
  { key: "status", label: "状态", type: "badge", dictId: "dict-customer-status" },
  { key: "lastFollowUpAt", label: "最近跟进", type: "date" },
  { key: "createdAt", label: "创建时间", type: "date" },
]

const filterFields: FilterField[] = [
  { key: "customerName", label: "客户名称", type: "text" },
  { key: "level", label: "客户级别", type: "select", dictId: "dict-customer-level" },
  { key: "status", label: "客户状态", type: "select", dictId: "dict-customer-status" },
]

const formFields: FormField[] = [
  { key: "customerName", label: "客户名称", type: "text", required: true },
  { key: "shortName", label: "客户简称", type: "text" },
  { key: "level", label: "客户级别", type: "select", dictId: "dict-customer-level", required: true },
  { key: "industry", label: "所在行业", type: "text" },
  { key: "region", label: "所在地区", type: "text" },
  { key: "employeeCount", label: "员工规模", type: "text" },
  { key: "registeredCapital", label: "注册资本（万元）", type: "number" },
  { key: "creditCode", label: "统一信用代码", type: "text" },
  { key: "address", label: "详细地址", type: "textarea", fullWidth: true },
]

function CustomersPage() {
  const navigate = useNavigate()
  const [data] = useState(customerMock)
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
          <p className="text-muted-foreground text-sm mt-1">企业级客户资源池 · 共 {data.length} 家客户</p>
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
