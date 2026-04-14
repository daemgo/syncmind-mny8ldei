import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable, type ColumnConfig } from "@/components/biz/data-table"
import { DataFilter, type FilterField } from "@/components/biz/data-filter"
import { FormDialog, type FormField } from "@/components/biz/form-dialog"
import { opportunityMock } from "@/mock/opportunity"
import type { Opportunity } from "@/types/opportunity"

export const Route = createFileRoute("/opportunities/")({
  component: OpportunitiesPage,
})

const columns: ColumnConfig<Opportunity>[] = [
  { key: "code", label: "编号", type: "mono" },
  { key: "opportunityName", label: "商机名称" },
  { key: "customerName", label: "所属客户" },
  { key: "stage", label: "当前阶段", type: "badge", dictId: "dict-opportunity-stage" },
  { key: "status", label: "状态", type: "badge", dictId: "dict-opportunity-status" },
  { key: "amount", label: "金额", type: "money", align: "right" },
  { key: "expectedCloseDate", label: "预计成交", type: "date" },
  { key: "ownerName", label: "归属销售" },
]

const filterFields: FilterField[] = [
  { key: "opportunityName", label: "商机名称", type: "text" },
  { key: "stage", label: "当前阶段", type: "select", dictId: "dict-opportunity-stage" },
  { key: "status", label: "商机状态", type: "select", dictId: "dict-opportunity-status" },
]

const formFields: FormField[] = [
  { key: "opportunityName", label: "商机名称", type: "text", required: true },
  { key: "customerName", label: "所属客户", type: "text", required: true },
  { key: "amount", label: "商机金额（元）", type: "number", required: true },
  { key: "stage", label: "当前阶段", type: "select", dictId: "dict-opportunity-stage", required: true },
  { key: "expectedCloseDate", label: "预计成交日期", type: "date" },
  { key: "ownerName", label: "归属销售", type: "text" },
  { key: "remark", label: "备注", type: "textarea", fullWidth: true },
]

function OpportunitiesPage() {
  const navigate = useNavigate()
  const [data] = useState(opportunityMock)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Opportunity | undefined>()
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filtered = data.filter((item) => {
    return Object.entries(filters).every(([key, val]) => {
      if (!val) return true
      const fieldVal = String((item as Record<string, unknown>)[key] ?? "")
      return fieldVal.toLowerCase().includes(val.toLowerCase())
    })
  })

  const openCount = data.filter((o) => o.status === "open").length
  const pipelineAmount = data.filter((o) => o.status === "open").reduce((sum, o) => sum + o.amount, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">商机管理</h1>
          <p className="text-muted-foreground text-sm mt-1">
            在跟商机 {openCount} 个 · 管道总额 ¥{(pipelineAmount / 10000).toFixed(0)}万
          </p>
        </div>
        <Button onClick={() => { setEditingItem(undefined); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />新建商机
        </Button>
      </div>
      <DataFilter fields={filterFields} values={filters} onChange={setFilters} />
      <DataTable
        columns={columns}
        data={filtered}
        onView={(item) => navigate({ to: "/opportunities/$id", params: { id: item.id } })}
        onEdit={(item) => { setEditingItem(item); setDialogOpen(true) }}
      />
      <FormDialog
        entityName="商机"
        fields={formFields}
        data={editingItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
