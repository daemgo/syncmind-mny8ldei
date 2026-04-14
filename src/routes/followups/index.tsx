import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable, type ColumnConfig } from "@/components/biz/data-table"
import { DataFilter, type FilterField } from "@/components/biz/data-filter"
import { FormDialog, type FormField } from "@/components/biz/form-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCrm } from "@/lib/crm-store"
import type { Followup } from "@/types/followups"
import { toast } from "sonner"

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

function FollowupsPage() {
  const navigate = useNavigate()
  const { customers, followups, addFollowup, updateFollowup, deleteFollowup } = useCrm()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Followup | undefined>()
  const [deletingItem, setDeletingItem] = useState<Followup | undefined>()
  const [filters, setFilters] = useState<Record<string, string>>({})

  const customerOptions = customers.map((c) => ({ label: c.name, value: c.id }))

  const formFields: FormField[] = [
    { key: "customerId", label: "客户名称", type: "select", required: true, options: customerOptions },
    { key: "contact", label: "联系人", type: "text" },
    { key: "type", label: "跟进方式", type: "select", dictId: "dict-followup-type" },
    { key: "result", label: "跟进结果", type: "select", dictId: "dict-followup-result" },
    { key: "stage", label: "商机阶段", type: "select", dictId: "dict-followup-stage" },
    { key: "sales", label: "负责人", type: "text" },
    { key: "amount", label: "商机金额 (元)", type: "number" },
    { key: "followupAt", label: "跟进日期", type: "date" },
    { key: "nextDate", label: "下次跟进日期", type: "date" },
    { key: "nextAction", label: "下次跟进事项", type: "text" },
    { key: "content", label: "跟进内容", type: "textarea", fullWidth: true },
  ]

  const filtered = followups.filter((item) => {
    return Object.entries(filters).every(([key, val]) => {
      if (!val) return true
      const fieldVal = String((item as Record<string, unknown>)[key] ?? "")
      return fieldVal.toLowerCase().includes(val.toLowerCase())
    })
  })

  function handleSubmit(formData: Record<string, string>) {
    const customer = customers.find((c) => c.id === formData.customerId)
    const customerName = customer?.name ?? formData.customerId

    if (editingItem) {
      updateFollowup(editingItem.id, { ...formData, customerName })
      toast.success("跟进记录已更新")
    } else {
      addFollowup({ ...formData, customerName })
      toast.success("跟进记录已创建")
    }
  }

  function handleDelete() {
    if (!deletingItem) return
    deleteFollowup(deletingItem.id)
    toast.success(`跟进记录「${deletingItem.code}」已删除`)
    setDeletingItem(undefined)
  }

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
        onDelete={(item) => setDeletingItem(item)}
      />
      <FormDialog
        entityName="跟进记录"
        fields={formFields}
        data={editingItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />
      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定删除「{deletingItem?.code}」的跟进记录？该操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
