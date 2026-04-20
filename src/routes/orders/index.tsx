import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable, type ColumnConfig } from "@/components/biz/data-table"
import { DataFilter, type FilterField } from "@/components/biz/data-filter"
import { FormDialog, type FormField } from "@/components/biz/form-dialog"
import { orderMock } from "@/mock/order"
import type { Order } from "@/types/order"

export const Route = createFileRoute("/orders/")({
  component: OrdersPage,
})

const columns: ColumnConfig<Order>[] = [
  { key: "orderNo", label: "订单号", type: "mono" },
  { key: "customerName", label: "客户名称" },
  { key: "amount", label: "订单金额", type: "money", align: "right" },
  { key: "status", label: "当前状态", type: "badge", dictId: "dict-order-status" },
  { key: "signedAt", label: "签约日期", type: "date" },
  { key: "expectedDeliveryDate", label: "预计交付", type: "date" },
]

const filterFields: FilterField[] = [
  { key: "keyword", label: "关键词", type: "text" },
  { key: "status", label: "订单状态", type: "select", dictId: "dict-order-status" },
]

const formFields: FormField[] = [
  { key: "customerId", label: "关联客户", type: "text", required: true },
  { key: "amount", label: "订单金额（元）", type: "number", required: true },
  { key: "signedAt", label: "签约日期", type: "date", required: true },
  { key: "expectedDeliveryDate", label: "预计交付日期", type: "date", required: true },
  { key: "equipmentType", label: "设备类型", type: "text" },
  { key: "techSpecs", label: "技术规格", type: "textarea", fullWidth: true },
  { key: "customRequirements", label: "定制要求", type: "textarea", fullWidth: true },
  { key: "acceptanceCriteria", label: "验收标准", type: "textarea", fullWidth: true },
]

function OrdersPage() {
  const navigate = useNavigate()
  const [data] = useState(orderMock)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Order | undefined>()
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filtered = data.filter((item) => {
    return Object.entries(filters).every(([key, val]) => {
      if (!val) return true
      const fieldVal = String((item as Record<string, unknown>)[key] ?? "")
      return fieldVal.toLowerCase().includes(val.toLowerCase())
    })
  })

  // Count orders by status for summary
  const statusCounts = data.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalAmount = data.reduce((sum, o) => sum + o.amount, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">订单管理</h1>
          <p className="text-muted-foreground text-sm mt-1">
            全部订单 {data.length} 个 · 合同总额 ¥{(totalAmount / 10000).toFixed(0)}万
          </p>
        </div>
        <Button onClick={() => { setEditingItem(undefined); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />新建订单
        </Button>
      </div>
      <DataFilter fields={filterFields} values={filters} onChange={setFilters} />
      <DataTable
        columns={columns}
        data={filtered}
        onView={(item) => navigate({ to: "/orders/$id", params: { id: item.id } })}
        onEdit={(item) => { setEditingItem(item); setDialogOpen(true) }}
      />
      <FormDialog
        entityName="订单"
        fields={formFields}
        data={editingItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
