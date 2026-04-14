import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent } from "@/components/ui/card"
import { GitBranch } from "lucide-react"

export const Route = createFileRoute("/process-config/")({
  component: ProcessConfigPage,
})

function ProcessConfigPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">流程配置</h1>
        <p className="text-muted-foreground text-sm mt-1">销售流程模板配置（管理员）</p>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <GitBranch className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-muted-foreground">该模块尚未生成</p>
            <p className="text-sm text-muted-foreground mt-1">请继续对话以生成流程配置完整页面</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
