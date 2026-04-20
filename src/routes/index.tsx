import { createFileRoute, Link } from "@tanstack/react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, DollarSign, Package } from "lucide-react"
import { opportunityMock } from "@/mock/opportunity"
import { customerMock } from "@/mock/customer"
import { orderMock } from "@/mock/order"
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
  Cell,
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

// Mock monthly sign data (last 6 months)
const monthlySignData = [
  { month: "11月", signAmount: 0, pipeline: 120 },
  { month: "12月", signAmount: 98, pipeline: 280 },
  { month: "1月", signAmount: 0, pipeline: 360 },
  { month: "2月", signAmount: 0, pipeline: 520 },
  { month: "3月", signAmount: 183, pipeline: 710 },
  { month: "4月", signAmount: 32, pipeline: 720 },
]

// Pipeline distribution by stage (万元)
const pipelineData = [
  { stage: "需求确认", amount: 32, color: "var(--color-chart-1)" },
  { stage: "方案评估", amount: 220, color: "var(--color-chart-2)" },
  { stage: "技术对接", amount: 58, color: "var(--color-chart-3)" },
  { stage: "商务谈判", amount: 128, color: "var(--color-chart-4)" },
]

const chartConfigTrend = {
  signAmount: { label: "签约金额(万)", color: "var(--color-chart-1)" },
  pipeline: { label: "管道金额(万)", color: "var(--color-chart-2)" },
} satisfies ChartConfig

const chartConfigPipeline = {
  amount: { label: "金额(万)", color: "var(--color-chart-1)" },
} satisfies ChartConfig

function Dashboard() {
  const activeCustomers = customerMock.filter((c) => c.pooledAt === null).length
  const activeOpps = opportunityMock.filter((o) => o.stage !== "signed")
  const totalPipeline = activeOpps.reduce((sum, o) => sum + o.amount, 0)
  const signedOpps = opportunityMock.filter((o) => o.stage === "signed")
  const totalSigned = signedOpps.reduce((sum, o) => sum + o.amount, 0)

  const activeOrders = orderMock.filter((o) => !["accepted", "shipped"].includes(o.status))
  const totalOrderAmount = orderMock.reduce((sum, o) => sum + o.amount, 0)

  // Sales rep performance (mock)
  const salesReps = [
    { rank: 1, repCode: "SR-001", name: "张磊", monthSignAmount: 183, opportunityCount: 2 },
    { rank: 2, repCode: "SR-002", name: "李婷", monthSignAmount: 0, opportunityCount: 1 },
    { rank: 3, repCode: "SR-003", name: "王强", monthSignAmount: 0, opportunityCount: 1 },
  ]

  // Order status summary
  const orderStatusSummary = [
    { status: "signed", label: "签约", orderCount: 1, totalAmount: 320000, warning: 0 },
    { status: "in_production", label: "生产中", orderCount: 1, totalAmount: 580000, warning: 0 },
    { status: "quality_check", label: "质检", orderCount: 1, totalAmount: 420000, warning: 0 },
    { status: "installing", label: "安装调试", orderCount: 1, totalAmount: 850000, warning: 0 },
    { status: "accepted", label: "验收", orderCount: 1, totalAmount: 980000, warning: 0 },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">销售看板</h1>
        <p className="text-muted-foreground text-sm mt-1">温州国彩真空 · 核心指标实时概览</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">本月签约</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">¥32万</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-200 dark:text-blue-400 text-xs">1单</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">商机管道</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">¥{(totalPipeline / 10000).toFixed(0)}万</span>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 text-xs">
                    {activeOpps.length}个在跟
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950">
                <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">活跃客户</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{activeCustomers}</span>
                  <span className="text-sm text-muted-foreground">/ {customerMock.length} 总数</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950">
                <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">在执行订单</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{activeOrders.length}</span>
                  <span className="text-sm text-muted-foreground">共 ¥{(totalOrderAmount / 10000).toFixed(0)}万</span>
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
            <CardTitle className="text-base">签约金额趋势</CardTitle>
            <CardDescription>近6个月签约金额与商机管道（万元）</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigTrend} className="h-[240px] w-full">
              <LineChart data={monthlySignData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}万`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="pipeline" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="signAmount" stroke="var(--color-chart-1)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">商机 Pipeline 分布</CardTitle>
            <CardDescription>各阶段商机金额分布（万元）</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigPipeline} className="h-[240px] w-full">
              <BarChart data={pipelineData} layout="vertical" margin={{ left: 16, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}万`} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={72} />
                <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [`${value}万`, "金额"]} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {pipelineData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`var(--color-chart-${index + 1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rankings & Order status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales ranking */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">销售排名</CardTitle>
            <CardDescription>按本月签约金额排序</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {salesReps.map((item) => (
                <div key={item.rank} className="flex items-center gap-4 px-6 py-3">
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    item.rank === 1 ? "bg-amber-100 text-amber-700" :
                    item.rank === 2 ? "bg-gray-100 text-gray-600" :
                    "bg-orange-50 text-orange-700"
                  )}>
                    {item.rank}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">商机 {item.opportunityCount} 个</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">¥{(item.monthSignAmount / 10000).toFixed(0)}万</p>
                    <p className="text-xs text-muted-foreground">本月签约</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order delivery status */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">订单交付进度</CardTitle>
            <CardDescription>各状态订单数量与金额</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {orderStatusSummary.map((item) => (
                <div key={item.status} className="flex items-center gap-4 px-6 py-3">
                  <Badge variant="outline" className={cn("shrink-0", getBadgeClassName(getDictColor("dict-order-status", item.status)))}>
                    {item.label}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.orderCount} 单</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">¥{(item.totalAmount / 10000).toFixed(0)}万</p>
                    {item.warning > 0 && <p className="text-xs text-red-500">{item.warning} 超期</p>}
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
