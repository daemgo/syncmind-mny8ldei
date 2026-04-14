import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Building2, MapPin, Users, DollarSign, Calendar, CreditCard } from "lucide-react"
import { customerMock, contactMock, customerFollowupMock } from "@/mock/customer"
import { opportunityMock } from "@/mock/opportunity"
import { getDictLabel, getDictColor, getBadgeClassName } from "@/lib/dict"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/customers/$id")({
  component: CustomerDetail,
})

function CustomerDetail() {
  const { id } = Route.useParams()
  const customer = customerMock.find((d) => d.id === id)
  if (!customer) return <div className="p-6 text-muted-foreground">未找到该客户</div>

  const contacts = contactMock.filter((c) => c.customerId === id)
  const followups = customerFollowupMock.filter((f) => f.customerId === id)
  const relatedOpportunities = opportunityMock.filter((o) => o.customerId === id)

  const industryMap: Record<string, string> = {
    machinery: "机械设备",
    automotive: "汽车",
    electronics: "电子",
    manufacturing: "通用制造",
    energy: "新能源",
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/customers"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{customer.customerName}</h1>
            <Badge variant="outline" className={cn("border font-medium", getBadgeClassName(getDictColor("dict-customer-level", customer.level)))}>
              {getDictLabel("dict-customer-level", customer.level)}
            </Badge>
            <Badge variant="outline" className={cn("border font-medium", getBadgeClassName(getDictColor("dict-customer-status", customer.status)))}>
              {getDictLabel("dict-customer-status", customer.status)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">简称：{customer.shortName} · 归属：{customer.ownerName}</p>
        </div>
        <Button variant="outline">编辑</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Basic Info */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={<Building2 className="h-4 w-4" />} label="所在行业" value={industryMap[customer.industry] ?? customer.industry} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="所在地区" value={customer.region} />
              <InfoRow icon={<Users className="h-4 w-4" />} label="员工规模" value={customer.employeeCount} />
              <InfoRow icon={<DollarSign className="h-4 w-4" />} label="注册资本" value={`¥${customer.registeredCapital.toLocaleString()}万元`} />
              <InfoRow icon={<CreditCard className="h-4 w-4" />} label="信用代码" value={customer.creditCode} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="录入时间" value={customer.createdAt} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">详细地址</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{customer.address}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Tabs */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <Tabs defaultValue="contacts">
              <CardHeader className="pb-0">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="contacts">联系人 ({contacts.length})</TabsTrigger>
                  <TabsTrigger value="opportunities">商机 ({relatedOpportunities.length})</TabsTrigger>
                  <TabsTrigger value="timeline">联系历史 ({followups.length})</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-4">

                {/* Contacts tab */}
                <TabsContent value="contacts" className="m-0">
                  {contacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">暂无联系人记录</p>
                  ) : (
                    <div className="space-y-3">
                      {contacts.map((c) => (
                        <div key={c.id} className="flex items-start justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{c.name}</span>
                              <Badge variant="outline" className={cn("text-xs", getBadgeClassName(getDictColor("dict-contact-importance", c.importance)))}>
                                {getDictLabel("dict-contact-importance", c.importance)}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{c.department} · {c.title}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-xs text-muted-foreground">{c.mobile}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full mt-2">+ 新建联系人</Button>
                    </div>
                  )}
                </TabsContent>

                {/* Opportunities tab */}
                <TabsContent value="opportunities" className="m-0">
                  {relatedOpportunities.length === 0 ? (
                    <div className="py-8 text-center space-y-3">
                      <p className="text-sm text-muted-foreground">暂无关联商机</p>
                      <Link to="/opportunities/">
                        <Button size="sm">新建商机</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {relatedOpportunities.map((o) => (
                        <div key={o.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
                          <div className="space-y-1">
                            <Link
                              to="/opportunities/$id"
                              params={{ id: o.id }}
                              className="font-medium text-sm hover:underline"
                            >
                              {o.opportunityName}
                            </Link>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn("text-xs", getBadgeClassName(getDictColor("dict-opportunity-stage", o.stage)))}>
                                {getDictLabel("dict-opportunity-stage", o.stage)}
                              </Badge>
                              <Badge variant="outline" className={cn("text-xs", getBadgeClassName(getDictColor("dict-opportunity-status", o.status)))}>
                                {getDictLabel("dict-opportunity-status", o.status)}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">¥{(o.amount / 10000).toFixed(0)}万</p>
                            <p className="text-xs text-muted-foreground">预计 {o.expectedCloseDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Timeline tab */}
                <TabsContent value="timeline" className="m-0">
                  {followups.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">暂无联系记录</p>
                  ) : (
                    <div className="relative space-y-0">
                      <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
                      {followups.map((f, idx) => (
                        <div key={f.id} className="relative flex gap-4 pb-6 last:pb-0">
                          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card border-2 border-border">
                            <Badge
                              variant="outline"
                              className={cn("h-4 w-4 rounded-full p-0 border-0", getBadgeClassName(getDictColor("dict-followup-type", f.type)))}
                            />
                          </div>
                          <div className="flex-1 pt-0.5 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn("text-xs", getBadgeClassName(getDictColor("dict-followup-type", f.type)))}>
                                {getDictLabel("dict-followup-type", f.type)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{f.occurredAt.slice(0, 10)}</span>
                              <span className="text-xs text-muted-foreground">· {f.ownerName}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{f.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
