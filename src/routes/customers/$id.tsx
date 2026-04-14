import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Building2, Phone, Mail, MapPin, Users, DollarSign, Calendar } from "lucide-react"
import { useCrm } from "@/lib/crm-store"
import { getDictLabel, getBadgeClassName } from "@/lib/dict"
import type { Customer } from "@/types/customers"

export const Route = createFileRoute("/customers/$id")({
  component: CustomerDetail,
})

function CustomerDetail() {
  const { id } = Route.useParams()
  const { customers, followups } = useCrm()
  const customer = customers.find((d) => d.id === id)
  if (!customer) return <div className="p-6 text-muted-foreground">未找到该客户</div>

  const relatedFollowups = followups.filter((f) => f.customerId === customer.id)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/customers"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <Badge className={getBadgeClassName(customer.status === "active" ? "green" : customer.status === "potential" ? "blue" : "gray")}>
              {getDictLabel("dict-customer-status", customer.status)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{customer.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Basic Info */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <InfoRow icon={<Building2 className="h-4 w-4" />} label="行业" value={getDictLabel("dict-customer-industry", customer.industry)} />
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="地区" value={customer.region} />
                <InfoRow icon={<Users className="h-4 w-4" />} label="员工规模" value={`${(customer.employees / 1000).toFixed(1)}k 人`} />
                <InfoRow icon={<DollarSign className="h-4 w-4" />} label="客户营收" value={`¥${(customer.revenue / 10000).toFixed(0)}万`} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="创建时间" value={customer.createdAt} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">联系方式</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <InfoRow icon={<Users className="h-4 w-4" />} label="联系人" value={customer.contact} />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="电话" value={customer.phone} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="邮箱" value={customer.email} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Tabs */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm h-full">
            <Tabs defaultValue="overview">
              <CardHeader className="pb-0">
                <TabsList>
                  <TabsTrigger value="overview">商机信息</TabsTrigger>
                  <TabsTrigger value="followups">跟进记录</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-4">
                <TabsContent value="overview" className="m-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">当前阶段</p>
                      <p className="font-semibold">{customer.stage}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">最近跟进</p>
                      <p className="font-semibold">{customer.lastFollowup}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">客户描述</p>
                    <p className="text-sm leading-relaxed">{customer.description}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-3">跟进计划</p>
                    {relatedFollowups.length > 0 ? (
                      <div className="space-y-2">
                        {relatedFollowups.map((f) => (
                          <div key={f.id} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div>
                              <p className="text-sm">{f.nextAction || "暂无计划"}</p>
                              <p className="text-xs text-muted-foreground">{f.nextDate || "待定"}</p>
                            </div>
                            <Badge className={getBadgeClassName(f.result === "positive" ? "green" : "gray")}>
                              {getDictLabel("dict-followup-result", f.result)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">暂无跟进计划</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="followups" className="m-0 space-y-3">
                  {relatedFollowups.length > 0 ? (
                    relatedFollowups.map((f) => (
                      <div key={f.id} className="p-4 rounded-xl border bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getBadgeClassName(f.result === "positive" ? "green" : f.result === "neutral" ? "yellow" : "gray")}>
                              {getDictLabel("dict-followup-type", f.type)}
                            </Badge>
                            <Badge variant="outline">{getDictLabel("dict-followup-stage", f.stage)}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{f.followupAt}</span>
                        </div>
                        <p className="text-sm mb-1">{f.content}</p>
                        <p className="text-xs text-muted-foreground">销售: {f.sales} · 联系人: {f.contact}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-8 text-center">暂无跟进记录</p>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="min-w-16">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
