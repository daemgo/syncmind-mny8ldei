import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Users, Building, DollarSign, Phone, BarChart3 } from "lucide-react"
import { customersMock } from "@/mock/customers"
import { followupsMock } from "@/mock/followups"
import { getDictLabel, getBadgeClassName } from "@/lib/dict"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts"

export const Route = createFileRoute("/")({
  component: Dashboard,
})

function Dashboard() {
  const totalCustomers = customersMock.length
  const activeCustomers = customersMock.filter((c) => c.status === "active").length
  const totalRevenue = customersMock.reduce((sum, c) => sum + c.revenue, 0)
  const totalAmount = followupsMock.reduce((sum, f) => sum + f.amount, 0)

  const revenueData = [
    { month: "1月", revenue: 128, target: 120 },
    { month: "2月", revenue: 156, target: 140 },
    { month: "3月", revenue: 189, target: 160 },
    { month: "4月", revenue: 218, target: 200 },
  ]

  const pipelineData = [
    { stage: "需求确认", value: 1200000, color: "var(--color-chart-1)" },
    { stage: "方案报价", value: 5600000, color: "var(--color-chart-2)" },
    { stage: "合同谈判", value: 3200000, color: "var(--color-chart-3)" },
    { stage: "已成交", value: 8900000, color: "var(--color-chart-4)" },
  ]

  const recentFollowups = followupsMock.slice(0, 5)

  const chartConfig = {
    revenue: { label: "实际营收", color: "var(--color-chart-1)" },
    target: { label: "目标营收", color: "var(--color-chart-2)" },
  } satisfies ChartConfig

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">数据看板</h1>
        <p className="text-muted-foreground text-sm mt-1">制造业 CRM 核心指标概览</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">客户总数</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{totalCustomers}</span>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 dark:text-emerald-400">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    +2
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950">
                <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">活跃客户</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{activeCustomers}</span>
                  <span className="text-sm text-muted-foreground">
                    / {totalCustomers}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950">
                <DollarSign className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">客户营收</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">¥{(totalRevenue / 10000).toFixed(0)}万</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950">
                <Phone className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">跟进商机</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">¥{(totalAmount / 10000).toFixed(0)}万</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">月度营收趋势</CardTitle>
            <CardDescription>近4个月实际 vs 目标对比</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
                <YAxis className="text-xs" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}万`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" stroke="var(--color-chart-2)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">销售漏斗</CardTitle>
            <CardDescription>各阶段商机金额分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ChartContainer config={{}} className="h-[200px] w-[200px]">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => `¥${Number(value).toLocaleString()}`} />
                </PieChart>
              </ChartContainer>
              <div className="space-y-3 flex-1">
                {pipelineData.map((item) => (
                  <div key={item.stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.stage}</span>
                    </div>
                    <span className="text-sm font-medium">¥{(item.value / 10000).toFixed(0)}万</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Followups */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">最近跟进</CardTitle>
              <CardDescription>最新5条销售活动记录</CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              3条积极
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentFollowups.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{item.customerName}</span>
                    <Badge className={getBadgeClassName(item.result === "positive" ? "green" : item.result === "neutral" ? "yellow" : "gray")}>
                      {getDictLabel("dict-followup-result", item.result)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.content}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium">¥{(item.amount / 10000).toFixed(0)}万</div>
                  <div className="text-xs text-muted-foreground">{item.followupAt}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
