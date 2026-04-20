import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Package, DollarSign, Calendar, User, CheckCircle2, Copy } from "lucide-react"
import { orderMock } from "@/mock/order"
import { getDictLabel, getDictColor, getBadgeClassName } from "@/lib/dict"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export const Route = createFileRoute("/orders/$id")({
  component: OrderDetail,
})

// Ordered stages for the step display (matching spec dict-order-status)
const ORDER_STAGES = [
  { value: "signed", label: "签约" },
  { value: "production_planning", label: "生产排期" },
  { value: "in_production", label: "生产中" },
  { value: "quality_check", label: "质检" },
  { value: "shipped", label: "发货" },
  { value: "installing", label: "安装调试" },
  { value: "accepted", label: "验收" },
]

function OrderDetail() {
  const { id } = Route.useParams()
  const order = orderMock.find((d) => d.id === id)
  if (!order) return <div className="p-6 text-muted-foreground">未找到该订单</div>

  const currentStageIdx = ORDER_STAGES.findIndex((s) => s.value === order.status)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://crm.example.com/orders/view/${order.orderNo}`)
    toast.success("查看链接已复制到剪贴板")
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/orders/"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{order.orderNo}</h1>
            <Badge variant="outline" className={cn("border font-medium", getBadgeClassName(getDictColor("dict-order-status", order.status)))}>
              {getDictLabel("dict-order-status", order.status)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            关联客户：<Link to="/customers/$id" params={{ id: order.customerId }} className="hover:underline text-primary">{order.customerName}</Link>
            {order.opportunityName && <span className="ml-3">商机：{order.opportunityName}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">编辑</Button>
          <Button variant="outline" onClick={handleCopyLink}><Copy className="mr-2 h-4 w-4" />复制查看链接</Button>
          {order.status !== "accepted" && <Button>推进状态</Button>}
        </div>
      </div>

      {/* Stage steps */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6 pb-4">
          <div className="flex items-center gap-0 overflow-x-auto">
            {ORDER_STAGES.map((stage, idx) => {
              const isDone = idx < currentStageIdx
              const isCurrent = idx === currentStageIdx
              return (
                <div key={stage.value} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[70px]">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0",
                        isDone ? "bg-green-500 border-green-500 text-white" :
                        isCurrent ? "bg-primary border-primary text-primary-foreground" :
                        "bg-muted border-border text-muted-foreground"
                      )}
                    >
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <span className={cn(
                      "text-xs text-center leading-tight",
                      isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
                    )}>
                      {stage.label}
                    </span>
                  </div>
                  {idx < ORDER_STAGES.length - 1 && (
                    <div className={cn("h-0.5 flex-1 mx-1", idx < currentStageIdx ? "bg-green-500" : "bg-border")} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic info */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">订单概览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={<DollarSign className="h-4 w-4" />} label="订单金额" value={`¥${order.amount.toLocaleString()}`} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="签约日期" value={order.signedAt} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="预计交付" value={order.expectedDeliveryDate} />
              {order.actualDeliveryDate && <InfoRow icon={<Calendar className="h-4 w-4" />} label="实际交付" value={order.actualDeliveryDate} />}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">设备信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={<Package className="h-4 w-4" />} label="设备类型" value={order.equipmentType} />
            </CardContent>
          </Card>
        </div>

        {/* Right: Equipment details */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">非标设备信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">技术规格</p>
                <p className="text-sm leading-relaxed">{order.techSpecs}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">定制要求</p>
                <p className="text-sm leading-relaxed">{order.customRequirements}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">验收标准</p>
                <p className="text-sm leading-relaxed">{order.acceptanceCriteria}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
