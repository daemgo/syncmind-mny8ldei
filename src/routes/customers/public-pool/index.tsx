import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Globe } from "lucide-react"

export const Route = createFileRoute("/customers/public-pool/")({
  component: PublicPoolPage,
})

function PublicPoolPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">公海池</h1>
        <p className="text-muted-foreground text-sm mt-1">超期未跟进客户自动释放，全员可认领</p>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Globe className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-muted-foreground">该模块尚未生成</p>
            <p className="text-sm text-muted-foreground mt-1">请继续对话以生成公海池完整页面</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
