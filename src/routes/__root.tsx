import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import "@/styles/globals.css";
import { AppShell } from "@/components/layout/app-shell"
import type { MenuItem } from "@/components/layout/sidebar"
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CheckSquare,
  GitBranch,
  Globe,
  UserCog,
  Shield,
} from "lucide-react"
import { CrmProvider } from "@/lib/crm-store"
import { Toaster } from "@/components/ui/sonner"

const menuItems: MenuItem[] = [
  { label: "销售驾驶舱", href: "/", icon: LayoutDashboard, group: "核心" },
  { label: "客户管理", href: "/customers", icon: Users, group: "业务" },
  { label: "公海池", href: "/customers/public-pool", icon: Globe, group: "业务" },
  { label: "商机管理", href: "/opportunities", icon: TrendingUp, group: "业务" },
  { label: "任务中心", href: "/tasks", icon: CheckSquare, group: "流程" },
  { label: "流程配置", href: "/process-config", icon: GitBranch, group: "流程" },
  { label: "员工管理", href: "/users", icon: UserCog, group: "系统" },
  { label: "角色权限", href: "/roles", icon: Shield, group: "系统" },
]

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "长机科技 CRM" },
      { name: "description", content: "宜昌长机科技销售管理系统" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="zh-CN">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Inter', 'Noto Sans SC', system-ui, sans-serif" }}>
        <CrmProvider>
          <AppShell title="长机 CRM" items={menuItems}>
            <Outlet />
          </AppShell>
          <Toaster richColors position="top-right" />
        </CrmProvider>
        <Scripts />
        <NavBridgeScript />
      </body>
    </html>
  );
}

function NavBridgeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function() {
  if (window === window.parent) return;
  var notify = function() {
    window.parent.postMessage({
      type: 'preview-navigation',
      pathname: location.pathname,
      url: location.href
    }, '*');
  };
  notify();
  var origPush = history.pushState;
  var origReplace = history.replaceState;
  history.pushState = function() {
    origPush.apply(this, arguments);
    notify();
  };
  history.replaceState = function() {
    origReplace.apply(this, arguments);
    notify();
  };
  window.addEventListener('popstate', notify);
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'preview-command') {
      if (e.data.command === 'back') history.back();
      if (e.data.command === 'forward') history.forward();
      if (e.data.command === 'navigate') {
        window.location.href = e.data.url;
      }
    }
  });
})();`,
      }}
    />
  );
}
