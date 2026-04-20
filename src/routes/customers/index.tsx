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
  { key: "code", label: "客户编号", type: "mono" },
  { key: "name", label: "客户名称" },
  { key: "industry", label: "行业", type: "badge", dictId: "dict-industry" },
  { key: "primaryContact", label: "联系人" },
  { key: "phone", label: "手机" },
  { key: "ownerName", label: "负责销售" },
  { key: "level", label: "客户等级", type: "badge", dictId: "dict-customer-level" },
  { key: "lastFollowUpAt", label: "最近跟进", type: "date" },
]

const filterFields: FilterField[] = [
  { key: "name", label: "关键词", type: "text" },
  { key: "industry", label: "行业", type: "select", dictId: "dict-industry" },
  { key: "ownerId", label: "负责销售", type: "select", dictId: "dict-sales-rep" },
  { key: "level", label: "客户等级", type: "select", dictId: "dict-customer-level" },
]

const formFields: FormField[] = [
  { key: "name", label: "客户名称", type: "text", required: true },
  { key: "industry", label: "行业", type: "select", dictId: "dict-industry" },
  { key: "scale", label: "企业规模", type: "select", dictId: "dict-company-scale" },
  { key: "address", label: "地址", type: "text" },
  { key: "website", label: "网址", type: "text" },
  { key: "level", label: "客户等级", type: "select", dictId: "dict-customer-level" },
  { key: "ownerId", label: "负责销售", type: "select", dictId: "dict-sales-rep" },
  { key: "primaryContact", label: "主联系人", type: "text" },
  { key: "phone", label: "手机", type: "text" },
  { key: "email", label: "邮箱", type: "text" },
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
          <p className="text-muted-foreground text-sm mt-1">客户档案库 · 共 {data.length} 家</p>
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
