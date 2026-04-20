import { createFileRoute, Link } from "@tanstack/react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, DollarSign, Target, BarChart3 } from "lucide-react"
import { opportunityMock } from "@/mock/opportunity"
import { customerMock } from "@/mock/customer"
import { getDictLabel, getDictColor, getBadgeClassName } from "@/lib/dict"
import { cn } from "@/lib/utils"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const Route = createFileRoute("/")({
  component: Dashboard,
})

// Static monthly trend data
const monthlyData = [
  { month: "11月", won: 0, pipeline: 1200 },
  { month: "12月", won: 32, pipeline: 2800 },
  { month: "1月", won: 0, pipeline: 3600 },
  { month: "2月", won: 0, pipeline: 5200 },
  { month: "3月", won: 0, pipeline: 7100 },
  { month: "4月", won: 32, pipeline: 7210 },
]

// Sales ranking mock data
const salesRanking = [
  { rank: 1, ownerName: "张磊", opportunityCount: 2, wonAmount: 320000, winRate: 50 },
  { rank: 2, ownerName: "李婷", opportunityCount: 2, wonAmount: 0, winRate: 0 },
  { rank: 3, ownerName: "王强", opportunityCount: 1, wonAmount: 0, winRate: 0 },
]

const chartConfigTrend = {
  pipeline: { label: "管道金额(万)", color: "var(--color-chart-1)" },
  won: { label: "赢单金额(万)", color: "var(--color-chart-2)" },
} satisfies ChartConfig

const chartConfigFunnel = {
  count: { label: "商机数", color: "var(--color-chart-1)" },
} satisfies ChartConfig

function Dashboard() {
  const totalLeads = opportunityMock.length
  const openOpportunities = opportunityMock.filter((o) => o.status === "open")
  const wonOpportunities = opportunityMock.filter((o) => o.status === "won")
  const lostOpportunities = opportunityMock.filter((o) => o.status === "lost")

  const totalWonAmount = wonOpportunities.reduce((sum, o) => sum + o.amount, 0)
  const winRate =
    wonOpportunities.length + lostOpportunities.length > 0
      ? Math.round((wonOpportunities.length / (wonOpportunities.length + lostOpportunities.length)) * 100)
      : 0

  const activeCustomers = customerMock.filter((c) => c.status === "active").length

  // Stage distribution for funnel chart
  const stages = [
    { stage: "线索", value: "lead" },
    { stage: "初步接触", value: "initialContact" },
    { stage: "技术交流", value: "technicalExchange" },
    { stage: "商务谈判", value: "businessNegotiation" },
    { stage: "合同签订", value: "contractSigned" },
    { stage: "回款完成", value: "paymentReceived" },
  ]
  const funnelData = stages.map((s) => ({
    stage: s.stage,
    count: opportunityMock.filter((o) => o.stage === s.value).length,
  })).filter((d) => d.count > 0)

  const recentOpportunities = [...opportunityMock]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">销售管理驾驶舱</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">商机总量</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{totalLeads}</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-200 dark:text-blue-400 text-xs">
                    {openOpportunities.length} 在跟
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">活跃客户</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{activeCustomers}</span>
                  <span className="text-sm text-muted-foreground">/ {customerMock.length}</span>
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
                <p className="text-sm text-muted-foreground">赢单金额</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">¥{(totalWonAmount / 10000).toFixed(0)}万</span>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 text-xs">
                    <TrendingUp className="h-3 w-3 mr-0.5" />本年
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950">
                <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">赢单率</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{winRate}%</span>
                  {winRate >= 50 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
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
            <CardTitle className="text-base">管道金额趋势</CardTitle>
            <CardDescription>近6个月商机管道与赢单金额（万元）</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigTrend} className="h-[240px] w-full">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}万`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="pipeline"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="won"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">商机阶段分布</CardTitle>
            <CardDescription>当前各销售阶段商机数量</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigFunnel} className="h-[240px] w-full">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 16, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={72} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rankings & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales ranking */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">业绩排名</CardTitle>
            <CardDescription>本月销售人员商机完成情况</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {salesRanking.map((item) => (
                <div key={item.rank} className="flex items-center gap-4 px-6 py-3">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      item.rank === 1 ? "bg-amber-100 text-amber-700" :
                      item.rank === 2 ? "bg-gray-100 text-gray-600" :
                      "bg-orange-50 text-orange-700"
                    )}
                  >
                    {item.rank}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.ownerName}</p>
                    <p className="text-xs text-muted-foreground">商机 {item.opportunityCount} 个</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">¥{(item.wonAmount / 10000).toFixed(0)}万</p>
                    <p className="text-xs text-muted-foreground">赢单率 {item.winRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent opportunities */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">近期活跃商机</CardTitle>
                <CardDescription>最近更新的5个商机</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentOpportunities.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/opportunities/$id"
                      params={{ id: item.id }}
                      className="text-sm font-medium hover:underline truncate block"
                    >
                      {item.opportunityName}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">{item.customerName}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getBadgeClassName(getDictColor("dict-opportunity-stage", item.stage)))}
                    >
                      {getDictLabel("dict-opportunity-stage", item.stage)}
                    </Badge>
                    <span className="text-sm font-medium text-right min-w-[52px]">
                      ¥{(item.amount / 10000).toFixed(0)}万
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
