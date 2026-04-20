import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building2, MapPin, Users, Globe, Phone, Mail, Calendar } from "lucide-react"
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/customers"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <Badge variant="outline" className={cn("border font-medium", getBadgeClassName(getDictColor("dict-customer-level", customer.level)))}>
              {getDictLabel("dict-customer-level", customer.level)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{customer.code} · 归属：{customer.ownerName || "未分配"}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/opportunities/new?customerId=:id" params={{ id: customer.id }}><Button variant="outline">新建商机</Button></Link>
          <Button variant="outline">编辑</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Basic Info */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={<Building2 className="h-4 w-4" />} label="行业" value={getDictLabel("dict-industry", customer.industry)} />
              <InfoRow icon={<Users className="h-4 w-4" />} label="企业规模" value={getDictLabel("dict-company-scale", customer.scale)} />
              <InfoRow icon={<Globe className="h-4 w-4" />} label="网址" value={customer.website || "-"} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="地址" value={customer.address} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="创建时间" value={customer.createdAt} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">主联系人</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={<Users className="h-4 w-4" />} label="姓名" value={customer.primaryContact} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="手机" value={customer.phone} />
              <InfoRow icon={<Mail className="h-4 w-4" />} label="邮箱" value={customer.email} />
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
                  <TabsTrigger value="timeline">跟进记录 ({followups.length})</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-4">

                {/* Contacts tab */}
                <TabsContent value="contacts" className="m-0">
                  {contacts.length === 0 ? (
                    <div className="py-8 text-center space-y-3">
                      <p className="text-sm text-muted-foreground">暂无联系人</p>
                      <Button variant="outline" size="sm">添加联系人</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contacts.map((c) => (
                        <div key={c.id} className="flex items-start justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{c.name}</span>
                              {c.isPrimary && <Badge variant="outline" className="text-xs bg-amber-50 border-amber-200 text-amber-700">主联系人</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{c.title}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-xs">{c.phone}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Opportunities tab */}
                <TabsContent value="opportunities" className="m-0">
                  {relatedOpportunities.length === 0 ? (
                    <div className="py-8 text-center space-y-3">
                      <p className="text-sm text-muted-foreground">暂无关联商机</p>
                      <Link to="/opportunities/"><Button size="sm">新建商机</Button></Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {relatedOpportunities.map((o) => (
                        <div key={o.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
                          <div className="space-y-1">
                            <Link to="/opportunities/$id" params={{ id: o.id }} className="font-medium text-sm hover:underline">
                              {o.name}
                            </Link>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn("text-xs", getBadgeClassName(getDictColor("dict-opportunity-stage", o.stage)))}>
                                {getDictLabel("dict-opportunity-stage", o.stage)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{o.ownerName}</span>
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
                    <p className="text-sm text-muted-foreground py-8 text-center">暂无跟进记录</p>
                  ) : (
                    <div className="relative space-y-0">
                      <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
                      {followups.map((f) => (
                        <div key={f.id} className="relative flex gap-4 pb-6 last:pb-0">
                          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card border-2 border-border">
                            <Badge variant="outline" className={cn("h-4 w-4 rounded-full p-0 border-0", getBadgeClassName(getDictColor("dict-followup-type", f.type)))} />
                          </div>
                          <div className="flex-1 pt-0.5 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn("text-xs", getBadgeClassName(getDictColor("dict-followup-type", f.type)))}>
                                {getDictLabel("dict-followup-type", f.type)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{f.occurredAt}</span>
                              <span className="text-xs text-muted-foreground">· {f.ownerName}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{f.summary}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full mt-4">记录跟进</Button>
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
