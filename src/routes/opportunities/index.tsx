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
  { key: "name", label: "商机名称" },
  { key: "customerName", label: "关联客户" },
  { key: "ownerName", label: "负责销售" },
  { key: "amount", label: "金额", type: "money", align: "right" },
  { key: "stage", label: "当前阶段", type: "badge", dictId: "dict-opportunity-stage" },
  { key: "expectedCloseDate", label: "预计签约日期", type: "date" },
]

const filterFields: FilterField[] = [
  { key: "name", label: "关键词", type: "text" },
  { key: "stage", label: "销售阶段", type: "select", dictId: "dict-opportunity-stage" },
  { key: "ownerId", label: "负责销售", type: "select", dictId: "dict-sales-rep" },
]

const formFields: FormField[] = [
  { key: "name", label: "商机名称", type: "text", required: true },
  { key: "customerId", label: "关联客户", type: "text", required: true },
  { key: "ownerId", label: "负责销售", type: "select", dictId: "dict-sales-rep", required: true },
  { key: "amount", label: "金额（元）", type: "number", required: true },
  { key: "stage", label: "销售阶段", type: "select", dictId: "dict-opportunity-stage", required: true },
  { key: "expectedCloseDate", label: "预计签约日期", type: "date" },
  { key: "note", label: "备注", type: "textarea", fullWidth: true },
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

  const activeOpps = data.filter((o) => o.stage !== "signed")
  const pipelineAmount = activeOpps.reduce((sum, o) => sum + o.amount, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">商机管理</h1>
          <p className="text-muted-foreground text-sm mt-1">
            在跟商机 {activeOpps.length} 个 · 管道总额 ¥{(pipelineAmount / 10000).toFixed(0)}万
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
