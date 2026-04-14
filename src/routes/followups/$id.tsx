import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Phone, Calendar, DollarSign, MessageSquare, Clock } from "lucide-react"
import { useCrm } from "@/lib/crm-store"
import { getDictLabel, getBadgeClassName } from "@/lib/dict"

export const Route = createFileRoute("/followups/$id")({
  component: FollowupDetail,
})

function FollowupDetail() {
  const { id } = Route.useParams()
  const { followups, customers } = useCrm()
  const item = followups.find((d) => d.id === id)
  if (!item) return <div className="p-6 text-muted-foreground">未找到该跟进记录</div>

  const customer = customers.find((c) => c.id === item.customerId)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/followups"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{item.code}</h1>
            <Badge className={getBadgeClassName(item.result === "positive" ? "green" : item.result === "neutral" ? "yellow" : "gray")}>
              {getDictLabel("dict-followup-result", item.result)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{item.customerName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Info */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">跟进信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={<User className="h-4 w-4" />} label="负责人" value={item.sales} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="联系人" value={item.contact} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="跟进日期" value={item.followupAt} />
              <InfoRow icon={<DollarSign className="h-4 w-4" />} label="商机金额" value={`¥${(item.amount / 10000).toFixed(0)}万`} />
              <InfoRow icon={<Badge className={`text-xs px-2 py-0.5 rounded-full ${getBadgeClassName(item.result === "positive" ? "green" : "gray")}`}>{getDictLabel("dict-followup-result", item.result)}</Badge>} label="跟进结果" value={getDictLabel("dict-followup-result", item.result)} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">阶段标签</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge className={getBadgeClassName("blue")}>{getDictLabel("dict-followup-type", item.type)}</Badge>
              <Badge className={getBadgeClassName("purple")}>{getDictLabel("dict-followup-stage", item.stage)}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Right: Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                跟进内容
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{item.content}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                下一步计划
              </CardTitle>
            </CardHeader>
            <CardContent>
              {item.nextAction ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="font-medium text-sm">{item.nextAction}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>计划日期: {item.nextDate}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">暂无下一步计划</p>
              )}
            </CardContent>
          </Card>

          {customer && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">关联客户</CardTitle>
                <CardDescription>{customer.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">客户名称</p>
                    <p className="text-sm font-medium">{customer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">当前阶段</p>
                    <p className="text-sm font-medium">{customer.stage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">客户营收</p>
                    <p className="text-sm font-medium">¥{(customer.revenue / 10000).toFixed(0)}万</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">最近跟进</p>
                    <p className="text-sm font-medium">{customer.lastFollowup}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
