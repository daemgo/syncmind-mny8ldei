import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, DollarSign, Calendar, User, Package } from "lucide-react"
import {
  opportunityMock,
  stageHistoryMock,
  opportunityFollowupMock,
  opportunityTaskMock,
} from "@/mock/opportunity"
import { getDictLabel, getDictColor, getBadgeClassName } from "@/lib/dict"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/opportunities/$id")({
  component: OpportunityDetail,
})

// Ordered stages for the step display
const STAGES = [
  { value: "lead", label: "线索" },
  { value: "initialContact", label: "初步接触" },
  { value: "technicalExchange", label: "技术交流" },
  { value: "businessNegotiation", label: "商务谈判" },
  { value: "contractSigned", label: "合同签订" },
  { value: "paymentReceived", label: "回款完成" },
]

function OpportunityDetail() {
  const { id } = Route.useParams()
  const opp = opportunityMock.find((d) => d.id === id)
  if (!opp) return <div className="p-6 text-muted-foreground">未找到该商机</div>

  const stageHistory = stageHistoryMock.filter((h) => h.opportunityId === id)
  const followups = opportunityFollowupMock.filter((f) => f.opportunityId === id)
  const tasks = opportunityTaskMock.filter((t) => t.opportunityId === id)

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
            <h1 className="text-2xl font-bold">{opp.opportunityName}</h1>
            <Badge variant="outline" className={cn("border font-medium", getBadgeClassName(getDictColor("dict-opportunity-status", opp.status)))}>
              {getDictLabel("dict-opportunity-status", opp.status)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{opp.code}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">编辑</Button>
          <Button>推进阶段</Button>
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
                      {isDone ? "✓" : idx + 1}
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
              <CardTitle className="text-base">商机信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={<DollarSign className="h-4 w-4" />} label="商机金额" value={`¥${opp.amount.toLocaleString()}`} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="预计成交" value={opp.expectedCloseDate} />
              <InfoRow icon={<User className="h-4 w-4" />} label="归属销售" value={opp.ownerName} />
              <InfoRow icon={<Package className="h-4 w-4" />} label="产品线" value={opp.productLine.map((p) => getDictLabel("dict-product-line", p)).join("、")} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">所属客户</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                to="/customers/$id"
                params={{ id: opp.customerId }}
                className="text-sm font-medium hover:underline text-primary"
              >
                {opp.customerName}
              </Link>
              {opp.remark && (
                <>
                  <p className="text-xs text-muted-foreground mt-3 mb-1">备注</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{opp.remark}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <Tabs defaultValue="followups">
              <CardHeader className="pb-0">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="followups">跟进记录 ({followups.length})</TabsTrigger>
                  <TabsTrigger value="stages">阶段变更 ({stageHistory.length})</TabsTrigger>
                  <TabsTrigger value="tasks">关联任务 ({tasks.length})</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-4">

                {/* Followups */}
                <TabsContent value="followups" className="m-0 space-y-3">
                  {followups.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">暂无跟进记录</p>
                  ) : (
                    followups.map((f) => (
                      <div key={f.id} className="p-4 rounded-xl border bg-card space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn("text-xs", getBadgeClassName(getDictColor("dict-followup-type", f.type)))}>
                              {getDictLabel("dict-followup-type", f.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{f.ownerName}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{f.occurredAt.slice(0, 10)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{f.content}</p>
                      </div>
                    ))
                  )}
                  <Button variant="outline" size="sm" className="w-full mt-2">+ 新建跟进记录</Button>
                </TabsContent>

                {/* Stage history */}
                <TabsContent value="stages" className="m-0">
                  <div className="relative space-y-0">
                    <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
                    {stageHistory.map((h) => (
                      <div key={h.id} className="relative flex gap-4 pb-5 last:pb-0">
                        <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card border-2 border-primary">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex-1 pt-0.5 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {h.fromStage && (
                              <>
                                <Badge variant="outline" className={cn("text-xs", getBadgeClassName(getDictColor("dict-opportunity-stage", h.fromStage)))}>
                                  {getDictLabel("dict-opportunity-stage", h.fromStage)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">→</span>
                              </>
                            )}
                            <Badge variant="outline" className={cn("text-xs", getBadgeClassName(getDictColor("dict-opportunity-stage", h.toStage)))}>
                              {getDictLabel("dict-opportunity-stage", h.toStage)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">· {h.operatorName} · {h.occurredAt.slice(0, 10)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{h.remark}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Tasks */}
                <TabsContent value="tasks" className="m-0 space-y-3">
                  {tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">暂无关联任务</p>
                  ) : (
                    tasks.map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border bg-card">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{t.taskName}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">负责人：{t.assigneeName}</span>
                            <span className="text-xs text-muted-foreground">截止：{t.deadline}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={cn("text-xs shrink-0", getBadgeClassName(getDictColor("dict-task-status", t.status)))}>
                          {getDictLabel("dict-task-status", t.status)}
                        </Badge>
                      </div>
                    ))
                  )}
                  <Button variant="outline" size="sm" className="w-full mt-2">+ 新建任务</Button>
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
