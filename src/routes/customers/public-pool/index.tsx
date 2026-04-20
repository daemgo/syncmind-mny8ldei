import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, UserPlus } from "lucide-react"
import { customerMock } from "@/mock/customer"
import { DataTable, type ColumnConfig } from "@/components/biz/data-table"
import { getDictLabel } from "@/lib/dict"
import type { Customer } from "@/types/customer"

export const Route = createFileRoute("/customers/public-pool/")({
  component: PublicPoolPage,
})

const columns: ColumnConfig<Customer>[] = [
  { key: "code", label: "客户编号", type: "mono" },
  { key: "name", label: "客户名称" },
  { key: "industry", label: "行业", type: "badge", dictId: "dict-industry" },
  { key: "source", label: "来源", type: "badge", dictId: "dict-customer-source" },
  { key: "pooledAt", label: "进入公海时间", type: "date" },
  { key: "primaryContact", label: "联系人" },
  { key: "phone", label: "手机" },
]

function PublicPoolPage() {
  const navigate = useNavigate()
  const pooledCustomers = customerMock.filter((c) => c.pooledAt !== null)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">公海池</h1>
        <p className="text-muted-foreground text-sm mt-1">未分配客户的统一入口 · 共 {pooledCustomers.length} 家</p>
      </div>
      {pooledCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Globe className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-muted-foreground">公海池暂无客户</p>
            <p className="text-sm text-muted-foreground mt-1">新建客户时未指定负责人，将自动进入公海池</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-end">
            <Button variant="outline"><UserPlus className="mr-2 h-4 w-4" />批量分配</Button>
          </div>
          <DataTable
            columns={columns}
            data={pooledCustomers}
            onView={(item) => navigate({ to: "/customers/$id", params: { id: item.id } })}
          />
        </>
      )}
    </div>
  )
}
