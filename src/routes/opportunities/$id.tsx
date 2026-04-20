import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, DollarSign, Calendar, User, FileText, CheckCircle2 } from "lucide-react"
import { opportunityMock, stageHistoryMock, opportunityAttachmentMock } from "@/mock/opportunity"
import { getDictLabel, getDictColor, getBadgeClassName } from "@/lib/dict"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/opportunities/$id")({
  component: OpportunityDetail,
})

// Ordered stages for the step display (matching spec dict-opportunity-stage)
const STAGES = [
  { value: "demand_confirmed", label: "需求确认" },
  { value: "scheme_evaluating", label: "方案评估" },
  { value: "tech_reviewing", label: "技术对接" },
  { value: "business_negotiating", label: "商务谈判" },
  { value: "signed", label: "已签约" },
]

function OpportunityDetail() {
  const { id } = Route.useParams()
  const opp = opportunityMock.find((d) => d.id === id)
  if (!opp) return <div className="p-6 text-muted-foreground">未找到该商机</div>

  const stageHistory = stageHistoryMock.filter((h) => h.opportunityId === id)
  const attachments = opportunityAttachmentMock.filter((a) => a.opportunityId === id)

  const currentStageIdx = STAGES.findIndex((s) => s.value === opp.stage)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/opportunities/"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{opp.name}</h1>
            <Badge variant="outline" className={cn("border font-medium", getBadgeClassName(getDictColor("dict-opportunity-stage", opp.stage)))}>
              {getDictLabel("dict-opportunity-stage", opp.stage)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{opp.code}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">编辑</Button>
          {opp.stage !== "signed" && <Button>推进阶段</Button>}
          <Link to="/orders/new?opportunityId=:id" params={{ id: opp.id }}><Button variant="outline">转为订单</Button></Link>
        </div>
      </div>

      {/* Stage steps */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6 pb-4">
          <div className="flex items-center gap-0 overflow-x-auto">
            {STAGES.map((stage, idx) => {
              const isDone = idx < currentStageIdx
              const isCurrent = idx === currentStageIdx
              return (
                <div key={stage.value} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[80px]">
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
                  {idx < STAGES.length - 1 && (
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
              <CardTitle className="text-base">商机概览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={<DollarSign className="h-4 w-4" />} label="预计金额" value={`¥${opp.amount.toLocaleString()}`} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="预计签约日期" value={opp.expectedCloseDate} />
              <InfoRow icon={<User className="h-4 w-4" />} label="负责销售" value={opp.ownerName} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">关联客户</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/customers/$id" params={{ id: opp.customerId }} className="text-sm font-medium hover:underline text-primary">
                {opp.customerName}
              </Link>
              {opp.note && (
                <>
                  <p className="text-xs text-muted-foreground mt-3 mb-1">备注</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{opp.note}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <Tabs defaultValue="history">
              <CardHeader className="pb-0">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="history">阶段历史 ({stageHistory.length})</TabsTrigger>
                  <TabsTrigger value="attachments">附件 ({attachments.length})</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-4">

                {/* Stage history */}
                <TabsContent value="history" className="m-0">
                  {stageHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">暂无阶段变更记录</p>
                  ) : (
                    <div className="relative space-y-0">
                      <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
                      {stageHistory.map((h) => (
                        <div key={h.id} className="relative flex gap-4 pb-5 last:pb-0">
                          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card border-2 border-primary">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                          <div className="flex-1 pt-0.5 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={cn("text-xs", getBadgeClassName(getDictColor("dict-opportunity-stage", h.stage)))}>
                                {getDictLabel("dict-opportunity-stage", h.stage)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">· {h.enteredAt}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{h.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Attachments */}
                <TabsContent value="attachments" className="m-0">
                  {attachments.length === 0 ? (
                    <div className="py-8 text-center space-y-3">
                      <p className="text-sm text-muted-foreground">暂无附件</p>
                      <Button variant="outline" size="sm">上传附件</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attachments.map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-4 rounded-xl border bg-card">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{a.fileName}</p>
                              <p className="text-xs text-muted-foreground">{a.uploaderName} · {a.uploadedAt}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">{a.fileType}</Badge>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full mt-2">上传附件</Button>
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
