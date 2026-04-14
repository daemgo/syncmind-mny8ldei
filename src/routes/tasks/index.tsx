import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type ColumnConfig } from "@/components/biz/data-table"
import { DataFilter, type FilterField } from "@/components/biz/data-filter"
import { taskMock } from "@/mock/task"
import type { Task } from "@/types/task"
import { getDictLabel, getDictColor, getBadgeClassName } from "@/lib/dict"
import { cn } from "@/lib/utils"
import { CheckCircle2, UserPlus } from "lucide-react"

export const Route = createFileRoute("/tasks/")({
  component: TasksPage,
})

const filterFields: FilterField[] = [
  { key: "taskType", label: "任务类型", type: "select", dictId: "dict-task-type" },
  { key: "status", label: "任务状态", type: "select", dictId: "dict-task-status" },
]

function TasksPage() {
  const [data, setData] = useState(taskMock)
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filtered = data.filter((item) => {
    return Object.entries(filters).every(([key, val]) => {
      if (!val) return true
      const fieldVal = String((item as Record<string, unknown>)[key] ?? "")
      return fieldVal.toLowerCase().includes(val.toLowerCase())
    })
  })

  function markComplete(id: string) {
    setData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
    )
  }

  function claimTask(id: string) {
    setData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, assigneeName: "我", assigneeId: "me", status: "inProgress" } : t))
    )
  }

  const pendingCount = data.filter((t) => t.status === "pending" || t.status === "inProgress").length
  const overdueCount = data.filter((t) => t.status === "overdue").length

  // Custom columns with action buttons in the row
  const columns: ColumnConfig<Task>[] = [
    { key: "code", label: "编号", type: "mono" },
    {
      key: "taskName",
      label: "任务名称",
      render: (_, row) => (
        <div>
          <p className="text-sm font-medium">{row.taskName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{row.sourceInfo}</p>
        </div>
      ),
    },
    { key: "taskType", label: "类型", type: "badge", dictId: "dict-task-type" },
    { key: "assigneeName", label: "负责人" },
    { key: "creatorName", label: "创建人" },
    { key: "deadline", label: "截止日期", type: "date" },
    {
      key: "status",
      label: "状态",
      render: (_, row) => {
        const isOverdue = row.status === "overdue"
        return (
          <Badge
            variant="outline"
            className={cn(
              "border font-medium text-xs",
              getBadgeClassName(getDictColor("dict-task-status", row.status)),
              isOverdue && "animate-pulse"
            )}
          >
            {getDictLabel("dict-task-status", row.status)}
          </Badge>
        )
      },
    },
    {
      key: "id",
      label: "操作",
      render: (_, row) => {
        if (row.status === "completed") {
          return <span className="text-xs text-muted-foreground">已完成</span>
        }
        return (
          <div className="flex items-center gap-1">
            {(row.status === "pending" || row.status === "inProgress") && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs px-2"
                onClick={() => markComplete(row.id)}
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />标记完成
              </Button>
            )}
            {row.status === "pending" && row.assigneeId !== "me" && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs px-2"
                onClick={() => claimTask(row.id)}
              >
                <UserPlus className="h-3 w-3 mr-1" />认领
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">任务中心</h1>
          <p className="text-muted-foreground text-sm mt-1">
            待处理 {pendingCount} 项
            {overdueCount > 0 && (
              <span className="ml-2 text-red-500 font-medium">· 已逾期 {overdueCount} 项</span>
            )}
          </p>
        </div>
      </div>
      <DataFilter fields={filterFields} values={filters} onChange={setFilters} />
      <DataTable columns={columns} data={filtered} />
    </div>
  )
}
