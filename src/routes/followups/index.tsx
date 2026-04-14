import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable, type ColumnConfig } from "@/components/biz/data-table"
import { DataFilter, type FilterField } from "@/components/biz/data-filter"
import { FormDialog, type FormField } from "@/components/biz/form-dialog"
import { followupsMock } from "@/mock/followups"
import type { Followup } from "@/types/followups"

export const Route = createFileRoute("/followups/")({
  component: FollowupsPage,
})

const columns: ColumnConfig<Followup>[] = [
  { key: "code", label: "编号", type: "mono" },
  { key: "customerName", label: "客户名称" },
  { key: "type", label: "跟进方式", type: "badge", dictId: "dict-followup-type" },
  { key: "result", label: "跟进结果", type: "badge", dictId: "dict-followup-result" },
  { key: "stage", label: "商机阶段", type: "badge", dictId: "dict-followup-stage" },
  { key: "sales", label: "负责人" },
  { key: "amount", label: "商机金额", type: "money", align: "right" },
  { key: "followupAt", label: "跟进日期", type: "date" },
]

const filterFields: FilterField[] = [
  { key: "customerName", label: "客户名称", type: "text" },
  { key: "type", label: "跟进方式", type: "select", dictId: "dict-followup-type" },
  { key: "result", label: "跟进结果", type: "select", dictId: "dict-followup-result" },
  { key: "stage", label: "商机阶段", type: "select", dictId: "dict-followup-stage" },
]

const formFields: FormField[] = [
  { key: "customerName", label: "客户名称", type: "text", required: true },
  { key: "contact", label: "联系人", type: "text" },
  { key: "type", label: "跟进方式", type: "select", dictId: "dict-followup-type" },
  { key: "content", label: "跟进内容", type: "text" },
  { key: "result", label: "跟进结果", type: "select", dictId: "dict-followup-result" },
  { key: "stage", label: "商机阶段", type: "select", dictId: "dict-followup-stage" },
  { key: "sales", label: "负责人", type: "text" },
  { key: "amount", label: "商机金额", type: "number" },
  { key: "nextDate", label: "下次跟进日期", type: "text" },
  { key: "nextAction", label: "下次跟进事项", type: "text" },
]

function FollowupsPage() {
  const navigate = useNavigate()
  const [data] = useState(followupsMock)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Followup | undefined>()
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
          <h1 className="text-2xl font-bold">销售跟进</h1>
          <p className="text-muted-foreground text-sm mt-1">记录和追踪所有销售活动</p>
        </div>
        <Button onClick={() => { setEditingItem(undefined); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />新建跟进
        </Button>
      </div>
      <DataFilter fields={filterFields} values={filters} onChange={setFilters} />
      <DataTable
        columns={columns}
        data={filtered}
        onView={(item) => navigate({ to: "/followups/$id", params: { id: item.id } })}
        onEdit={(item) => { setEditingItem(item); setDialogOpen(true) }}
      />
      <FormDialog
        entityName="跟进记录"
        fields={formFields}
        data={editingItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
