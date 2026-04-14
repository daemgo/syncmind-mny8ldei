import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

export const Route = createFileRoute("/roles/")({
  component: RolesPage,
})

function RolesPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">角色权限</h1>
        <p className="text-muted-foreground text-sm mt-1">RBAC 角色与权限配置</p>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Shield className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-muted-foreground">该模块尚未生成</p>
            <p className="text-sm text-muted-foreground mt-1">请继续对话以生成角色权限完整页面</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
