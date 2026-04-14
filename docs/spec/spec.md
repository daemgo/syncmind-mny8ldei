> **版本**：1.0.0 | **状态**：draft | **更新时间**：2026-04-14T10:00:00+08:00
>
> **来源方案**：normal 场景 v1.0.0 版本

---

#### 约定说明

本文档使用以下标准值：
- **布局类型**: `list` / `detail` / `form` / `dashboard` / `steps` / `custom`
- **区块类型**: `table` / `form` / `card` / `cards` / `chart` / `tabs` / `steps` / `timeline` / `description` / `statistic` / `custom`
- **字段类型**: `text` / `textarea` / `number` / `money` / `date` / `select` / `multiselect` / `switch` / `upload` 等
- **列类型**: `text` / `number` / `money` / `date` / `datetime` / `tag` / `status` / `avatar` / `link` / `progress` / `action`
- **操作行为**: `navigate` / `modal` / `drawer` / `action` / `download`

---

#### 一、产品概述

### 1.1 项目背景

宜昌长机科技做全系列齿轮加工机床，数控插齿机国内市场占有率约70%，同时提供设备再制造服务。在离散型多品种小批量的生产模式下，销售团队目前面临三个现实问题：客户资源分散在各个销售手里、跟进过程不透明、复购机会难以追踪。公司已有国家级5G工厂，这次是要把销售管理这块短板补上。系统必须本地部署，数据不出厂区。

### 1.2 产品目标

- 建立企业级客户资源池，将客户资产从"个人资源"转为"企业资源"，降低离职风险
- 实现线索到回款全流程标准化管理，统一销售动作，减少关键动作遗漏
- 为销售主管提供可视化驾驶舱，实时掌握团队商机状态，支持数据驱动决策
- 支持基于设备生命周期的增值服务延伸（本期不做）

### 1.3 目标用户

| 角色 | 描述 | 核心诉求 |
|------|------|----------|
| 销售人员 | 一线销售，使用CRM记录日常客户跟进 | 快速录入客户、快速查重、减少重复填报、商机状态一目了然 |
| 销售主管 | 团队管理者，关注全局商机进展 | 实时看全局漏斗、识别高风险商机、跨团队协同 |
| 管理层 | 高层领导，关注整体业绩 | 核心指标看板、业绩排名、预测营收 |
| 售前工程师 | 配合销售提供技术支持 | 及时收到协同通知、查看技术交流任务 |

### 1.4 范围定义

**本期包含：**
- 客户管理模块（企业级客户库、客户360视图、公海池）
- 商机管理模块（商机全生命周期、阶段推进留痕）
- 销售流程管理模块（标准化流程引擎、任务清单驱动、协同工作流）
- 销售管理驾驶舱（核心指标看板、商机漏斗分析、销售排名）

**本期不含：**
- 报价单与合同管理模块（P2功能，纳入第二阶段）
- 设备台账关联模块（P2功能，纳入第三阶段）
- ERP、财务系统深度集成（第三阶段根据接口情况推进）
- 移动端原生App（Web端全功能覆盖）

---

#### 二、信息架构

### 2.1 站点地图

- 📁 销售管理驾驶舱（icon: LayoutDashboard）
  - 核心指标看板 → `/dashboard`
- 📁 客户管理（icon: Users）
  - 客户列表 → `/customers`
  - 客户详情 → `/customers/:id`
  - 公海池 → `/customers/public-pool`
- 📁 商机管理（icon: TrendingUp）
  - 商机列表 → `/opportunities`
  - 商机详情 → `/opportunities/:id`
  - 新建商机 → `/opportunities/new`
- 📁 销售流程（icon: GitBranch）
  - 任务中心 → `/tasks`
  - 流程配置 → `/process-config`（管理员）
- 📁 系统管理（icon: Settings）（管理员可见）
  - 组织架构 → `/org`
  - 员工管理 → `/users`
  - 角色权限 → `/roles`

### 2.2 导航结构

| 一级菜单 | 二级菜单 | 路由 | 说明 |
|----------|----------|------|------|
| 销售管理驾驶舱 | 核心指标看板 | `/dashboard` | 默认首页，含统计卡片、漏斗图、业绩排行 |
| 客户管理 | 客户列表 | `/customers` | 统一客户库，含筛选、查重、分配 |
| 客户管理 | 公海池 | `/customers/public-pool` | 释放客户池，超期未跟进自动入池 |
| 商机管理 | 商机列表 | `/opportunities` | 全生命周期商机管理，含阶段筛选 |
| 销售流程 | 任务中心 | `/tasks` | 流程待办任务清单，支持认领和完成 |
| 销售流程 | 流程配置 | `/process-config` | 销售流程模板配置（管理员） |
| 系统管理 | 员工管理 | `/users` | 员工账号管理 |
| 系统管理 | 角色权限 | `/roles` | RBAC角色与权限配置 |

---

#### 三、功能模块

### 3.1 销售管理驾驶舱

> 解决"老板看不到销售漏斗全貌"的问题。提供核心指标可视化和业绩追踪，让管理层用数据驱动决策。

#### 3.1.1 驾驶舱首页

**路由**：`/dashboard`
**布局**：`dashboard`
**描述**：销售核心指标概览与业绩排名主页

##### 统计概览（statistic）

| 指标 | fieldKey | 说明 |
|------|----------|------|
| 线索总量 | totalLeads | 统计周期内新增线索数 |
| 商机总量 | totalOpportunities | 当前在跟商机数 |
| 赢单金额 | wonAmount | 统计周期内成交金额 |
| 赢单率 | winRate | 赢单数/输单数赢单百分比 |
| 平均商机周期 | avgOpportunityCycle | 从线索到赢单平均天数 |
| 预测营收 | predictedRevenue | 当前在跟商机加权预测金额 |

##### 商机漏斗（chart）

| 图表 | 类型 | 数据说明 |
|------|------|----------|
| 商机阶段漏斗 | funnel | 各阶段商机数量，识别转化瓶颈 |

##### 业绩排名（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 排名 | rank | number | 否 | 自动序号 |
| 销售人员 | ownerName | avatar | 否 | 姓名+头像 |
| 商机数 | opportunityCount | number | 是 | 当前在跟商机总数 |
| 赢单金额 | wonAmount | money | 是 | 本周期赢单金额 |
| 赢单率 | winRate | percent | 是 | 赢单百分比 |

##### 近期活跃商机（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 商机名称 | opportunityName | link | 否 | 跳转商机详情 |
| 所属客户 | customerName | text | 否 | 客户名称 |
| 当前阶段 | stage | tag | 否 | dict-opportunity-stage |
| 金额 | amount | money | 否 | 商机金额 |
| 更新时间 | updatedAt | datetime | 是 | 最近一次状态变更时间 |

##### 业务规则

- 统计周期默认为本月，支持切换为本周/本月/本季度/本年
- 漏斗图默认展示当前在跟商机各阶段分布
- 业绩排名默认按赢单金额降序
- 预测营收 = 各阶段商机金额 × 阶段赢率权重（待确认权重配置）

---

### 3.2 客户管理模块

> 解决"客户资源分散在各销售手里，离职即流失"的问题。将客户资产从个人资源变为企业资源，支持统一录入、查重和分配。

#### 3.2.1 客户列表

**路由**：`/customers`
**布局**：`list`
**描述**：企业级客户库，支持筛选、查重、新增和批量分配

##### 筛选条件（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 客户名称 | customerName | text | 否 | 模糊搜索 |
| 客户级别 | level | select | 否 | 选项来源: dict-customer-level |
| 所在行业 | industry | select | 否 | 选项来源: dict-industry |
| 归属销售 | ownerId | user | 否 | 销售人员筛选 |
| 客户状态 | status | select | 否 | 选项来源: dict-customer-status |

##### 数据列表（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 客户名称 | customerName | link | 是 | 跳转客户详情 |
| 客户级别 | level | tag | 否 | dict-customer-level |
| 所在行业 | industry | text | 是 | 行业分类 |
| 归属销售 | ownerName | avatar | 否 | 销售人员 |
| 最近跟进 | lastFollowUpAt | datetime | 是 | 最近跟进时间 |
| 创建时间 | createdAt | date | 是 | 录入时间 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 | 权限 |
|------|------|------|------|------|
| 新建客户 | primary | toolbar-right | navigate → `/customers/new` | 销售/管理员 |
| 批量分配 | default | toolbar | modal 批量分配弹窗 | 管理员 |
| 导出 | default | toolbar | download 导出Excel | 销售/管理员 |

##### 业务规则

- 新建客户时自动触发查重提醒（同名/相似名称提示），避免撞单
- 归属销售仅管理员可修改，普通销售只能查看
- 客户列表默认只显示本人及下辖客户，管理员可看全部

#### 3.2.2 客户详情

**路由**：`/customers/:id`
**布局**：`detail`
**描述**：客户360视图，汇聚基本信息、联系历史、商机记录

##### 基本信息（description）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 客户名称 | customerName | text | 企业全称 |
| 客户简称 | shortName | text | 简称 |
| 客户级别 | level | tag | dict-customer-level |
| 所在行业 | industry | text | 行业分类 |
| 注册资本 | registeredCapital | money | 万元 |
| 员工规模 | employeeCount | text | 人数规模 |
| 所在地区 | region | text | 省/市/区 |
| 地址 | address | text | 详细地址 |
| 统一社会信用代码 | creditCode | text | 营业执照号 |

##### 联系人列表（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 姓名 | name | text | 否 | 联系人姓名 |
| 部门 | department | text | 否 | 任职部门 |
| 职位 | title | text | 否 | 职位 |
| 手机 | mobile | phone | 否 | 脱敏展示 |
| 邮箱 | email | email | 否 | 邮箱 |
| 重要程度 | importance | tag | 否 | dict-contact-importance |
| 操作 | - | action | 否 | 编辑/删除 |

##### 联系历史（timeline）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 时间 | occurredAt | datetime | 联系时间 |
| 类型 | type | tag | dict-followup-type |
| 跟进人 | ownerName | text | 跟进人员 |
| 内容 | content | text | 联系摘要 |

##### 关联商机（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 商机名称 | opportunityName | link | 否 | 跳转商机详情 |
| 商机阶段 | stage | tag | 否 | dict-opportunity-stage |
| 金额 | amount | money | 是 | 预估金额 |
| 预计成交 | expectedCloseDate | date | 是 | 预计成交日期 |
| 状态 | status | status | 否 | dict-opportunity-status |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 编辑 | default | card-header | drawer 编辑表单 |
| 新建联系人 | default | card-footer | modal 新建联系人 |
| 新建商机 | primary | card-footer | navigate → `/opportunities/new?customerId=:id` |

##### 业务规则

- 联系人手机和邮箱敏感字段，仅归属销售和管理员可见
- 删除联系人前检查是否有关联商机，如有则阻断

#### 3.2.3 公海池

**路由**：`/customers/public-pool`
**布局**：`list`
**描述**：超期未跟进客户自动释放进入公海，全体销售人员可认领

##### 数据列表（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 客户名称 | customerName | link | 否 | 跳转客户详情 |
| 客户级别 | level | tag | 否 | dict-customer-level |
| 上次跟进 | lastFollowUpAt | datetime | 是 | 末次跟进时间 |
| 入池时间 | poolEnteredAt | datetime | 是 | 进入公海时间 |
| 原归属销售 | previousOwnerName | text | 否 | 原归属人员 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 认领 | primary | row | action 确认认领后绑定本人 |
| 查看详情 | default | row-more | navigate 客户详情 |

##### 业务规则

- 客户连续 [X] 天未跟进记录（[X] 可配置，默认30天）自动入公海
- 销售认领后自动成为归属销售
- 公海客户其他人不可见，直到被认领或重新分配

---

### 3.3 商机管理模块

> 解决"商机状态不透明，主管无法实时掌握团队跟进进展"的问题。商机全生命周期支持自定义阶段，阶段变更全程留痕。

#### 3.3.1 商机列表

**路由**：`/opportunities`
**布局**：`list`
**描述**：全部商机列表，支持按阶段、归属销售、金额范围筛选

##### 筛选条件（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 商机名称 | opportunityName | text | 否 | 模糊搜索 |
| 所属客户 | customerId | select | 否 | 客户筛选 |
| 当前阶段 | stage | multiselect | 否 | 选项来源: dict-opportunity-stage |
| 归属销售 | ownerId | user | 否 | 销售人员筛选 |
| 预计成交日期 | expectedCloseDateRange | daterange | 否 | 成交日期区间 |
| 金额范围 | amountRange | custom | 否 | 金额区间筛选 |

##### 数据列表（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 商机名称 | opportunityName | link | 否 | 跳转商机详情 |
| 所属客户 | customerName | text | 否 | 客户名称 |
| 当前阶段 | stage | tag | 是 | dict-opportunity-stage |
| 金额 | amount | money | 是 | 预估金额 |
| 预计成交 | expectedCloseDate | date | 是 | 预计成交日期 |
| 归属销售 | ownerName | avatar | 否 | 销售人员 |
| 更新时间 | updatedAt | datetime | 是 | 最近状态变更 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 新建商机 | primary | toolbar-right | navigate → `/opportunities/new` |

##### 业务规则

- 商机列表默认按更新时间降序
- 销售只可见本人商机，主管可见团队全部，管理员可见全部

#### 3.3.2 商机详情

**路由**：`/opportunities/:id`
**布局**：`detail`
**描述**：商机全生命周期详情，含阶段推进、跟进记录和任务

##### 基本信息（description）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 商机名称 | opportunityName | text | 商机名称 |
| 所属客户 | customerId | link | 跳转客户详情 |
| 商机金额 | amount | money | 预估金额 |
| 当前阶段 | stage | tag | dict-opportunity-stage |
| 预计成交日期 | expectedCloseDate | date | 预计成交日期 |
| 归属销售 | ownerId | user | 归属人员 |
| 产品线 | productLine | multiselect | 选项来源: dict-product-line |
| 创建时间 | createdAt | datetime | 创建时间 |
| 更新时间 | updatedAt | datetime | 最近变更时间 |

##### 阶段推进（steps）

| 阶段 | 阶段ID | 说明 |
|------|--------|------|
| 线索 | lead | 待确认需求 |
| 初步接触 | initialContact | 已建立联系 |
| 技术交流 | technicalExchange | 售前介入中 |
| 商务谈判 | businessNegotiation | 商务条款协商 |
| 合同签订 | contractSigned | 已签合同 |
| 回款 | paymentReceived | 回款完成 |

##### 阶段变更记录（timeline）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 变更时间 | occurredAt | datetime | 变更时间戳 |
| 操作人 | operatorName | text | 操作人员 |
| 从 | fromStage | tag | 变更前阶段 |
| 到 | toStage | tag | 变更后阶段 |
| 备注 | remark | textarea | 变更说明 |

##### 跟进记录（timeline）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 时间 | occurredAt | datetime | 跟进时间 |
| 类型 | type | tag | dict-followup-type |
| 跟进人 | ownerName | text | 跟进人员 |
| 内容 | content | textarea | 跟进详情 |

##### 关联任务（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 任务名称 | taskName | text | 否 | 任务描述 |
| 负责人 | assigneeName | avatar | 否 | 责任人 |
| 截止日期 | deadline | date | 是 | 截止时间 |
| 状态 | status | tag | 否 | dict-task-status |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 编辑 | default | card-header | drawer 编辑表单 |
| 推进阶段 | primary | card-footer | modal 阶段推进确认（含备注） |
| 新建跟进 | default | card-footer | modal 新建跟进记录 |
| 新建任务 | default | card-footer | modal 新建待办任务 |

##### 业务规则

- 阶段推进强制填写变更说明（remark），避免空推进
- 阶段变更时自动记录操作人和时间戳，不可修改
- 归属销售可新建任务给自己或团队成员
- 管理员可修改任意商机归属销售

#### 3.3.3 新建商机

**路由**：`/opportunities/new`
**布局**：`form`
**描述**：新建商机表单，必填字段最少化

##### 基本信息（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 商机名称 | opportunityName | text | 是 | 商机名称 |
| 所属客户 | customerId | select | 是 | 从客户列表选择，新建时自动跳转新建 |
| 商机金额 | amount | money | 是 | 预估金额 |
| 当前阶段 | stage | select | 是 | 默认"线索"，选项来源: dict-opportunity-stage |
| 预计成交日期 | expectedCloseDate | date | 否 | 预计成交日期 |
| 产品线 | productLine | multiselect | 否 | 选项来源: dict-product-line |
| 备注 | remark | textarea | 否 | 初始备注 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 保存 | primary | form-footer | action 保存并跳转商机详情 |
| 取消 | default | form-footer | navigate 返回商机列表 |

##### 业务规则

- 保存后自动创建初始跟进记录（来源：新建商机）
- 商机阶段初始默认为"线索"

---

### 3.4 销售流程管理模块

> 解决"销售过程依赖个人经验，标准化程度低"的问题。流程引擎预置齿轮机床行业模板，任务清单驱动关键动作落地。

#### 3.4.1 任务中心

**路由**：`/tasks`
**布局**：`list`
**描述`：当前用户待办任务清单，支持认领和完成

##### 筛选条件（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 任务类型 | taskType | multiselect | 否 | 选项来源: dict-task-type |
| 关联对象 | relatedType | select | 否 | 关联商机/客户 |
| 截止日期 | deadlineRange | daterange | 否 | 截止日期区间 |
| 状态 | status | multiselect | 否 | 选项来源: dict-task-status |

##### 数据列表（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 任务名称 | taskName | text | 否 | 任务描述 |
| 类型 | taskType | tag | 否 | dict-task-type |
| 来源 | sourceInfo | text | 否 | 关联对象名称 |
| 负责人 | assigneeName | avatar | 否 | 责任人 |
| 创建人 | creatorName | text | 否 | 任务发起人 |
| 截止日期 | deadline | date | 是 | 截止时间 |
| 状态 | status | tag | 否 | dict-task-status |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 标记完成 | primary | row | action 确认完成 |
| 认领任务 | default | row | action 认领后绑定本人 |

##### 业务规则

- 任务逾期但未完成，显示红色警示
- 负责人完成任务后自动流转至下一节点（由流程引擎控制）
- 协同任务（非本人创建但可认领）从公海池逻辑中产生

#### 3.4.2 流程配置

**路由**：`/process-config`
**布局**：`list`
**描述**：销售流程模板配置，管理员可按产品线差异化配置

##### 流程模板列表（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 模板名称 | templateName | link | 否 | 模板名称 |
| 适用产品线 | productLine | tag | 否 | dict-product-line |
| 阶段数 | stageCount | number | 否 | 阶段总数 |
| 启用状态 | enabled | switch | 否 | 是否启用 |
| 更新时间 | updatedAt | datetime | 是 | 最后修改时间 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 编辑模板 | default | row-more | navigate → `/process-config/:id` |
| 启用/停用 | default | row | action 切换启用状态 |

##### 业务规则

- 默认模板不可删除，可编辑
- 启用状态切换需确认，影响使用该模板的新建商机
- 流程变更不追溯已有商机

---

#### 四、全局规则

### 4.1 角色权限

| 角色 | 描述 | 模块权限 |
|------|------|----------|
| 销售人员 | 一线销售 | 客户管理（本人数据）、商机管理（本人数据）、任务中心（本人任务）、驾驶舱（仅本人数据） |
| 销售主管 | 团队管理者 | 客户管理（团队数据）、商机管理（团队数据）、任务中心（团队任务）、驾驶舱（团队全部数据） |
| 管理员 | 系统管理员 | 全部模块读写，含流程配置、员工管理、角色权限 |
| 售前工程师 | 技术支持 | 商机管理（查看协同任务）、任务中心（本人及被指派任务） |
| 管理层 | 高层领导 | 驾驶舱（全部数据只读）、客户管理（只读） |

### 4.2 数据字典

#### 4.2.1 客户级别（dict-customer-level）

| 值 | 显示 | 颜色 |
|----|------|------|
| A | A类客户 | red |
| B | B类客户 | orange |
| C | C类客户 | blue |

#### 4.2.2 客户状态（dict-customer-status）

| 值 | 显示 | 颜色 |
|----|------|------|
| active | 跟进中 | green |
| inactive | 久未跟进 | grey |
| churned | 已流失 | red |

#### 4.2.3 联系人重要程度（dict-contact-importance）

| 值 | 显示 | 颜色 |
|----|------|------|
| key | 关键决策人 | red |
| influence | 有影响力 | orange |
| normal | 普通联系人 | blue |

#### 4.2.4 商机阶段（dict-opportunity-stage）

| 值 | 显示 | 颜色 |
|----|------|------|
| lead | 线索 | grey |
| initialContact | 初步接触 | blue |
| technicalExchange | 技术交流 | cyan |
| businessNegotiation | 商务谈判 | orange |
| contractSigned | 合同签订 | green |
| paymentReceived | 回款完成 | green |

#### 4.2.5 商机状态（dict-opportunity-status）

| 值 | 显示 | 颜色 |
|----|------|------|
| open | 进行中 | blue |
| won | 赢单 | green |
| lost | 输单 | red |
| cancelled | 已取消 | grey |

#### 4.2.6 跟进类型（dict-followup-type）

| 值 | 显示 | 颜色 |
|----|------|------|
| visit | 拜访 | blue |
| call | 电话 | cyan |
| meeting | 会议 | orange |
| email | 邮件 | grey |
| other | 其他 | grey |

#### 4.2.7 任务类型（dict-task-type）

| 值 | 显示 | 颜色 |
|----|------|------|
| followup | 跟进任务 | blue |
| technical | 技术交流 | cyan |
| approval | 审批任务 | orange |
| delivery | 交付任务 | green |

#### 4.2.8 任务状态（dict-task-status）

| 值 | 显示 | 颜色 |
|----|------|------|
| pending | 待处理 | blue |
| inProgress | 进行中 | orange |
| completed | 已完成 | green |
| overdue | 已逾期 | red |

#### 4.2.9 产品线（dict-product-line）

| 值 | 显示 | 颜色 |
|----|------|------|
| machine | 整机 | blue |
| parts | 配件 | orange |
| remanufacturing | 再制造 | green |

### 4.3 状态流转

#### 4.3.1 商机状态流转

**状态定义：**

| 状态 | 显示 | 颜色 | 说明 |
|------|------|------|------|
| open | 进行中 | blue | 正常跟进的商机 |
| won | 赢单 | green | 成功成交 |
| lost | 输单 | red | 丢单 |
| cancelled | 已取消 | grey | 主动取消 |

**流转规则：**

| 当前状态 | 操作 | 目标状态 | 条件 |
|----------|------|----------|------|
| open | 赢单 | won | 合同签订后，由销售或管理员操作 |
| open | 输单 | lost | 明确丢单原因后，由销售或管理员操作 |
| open | 取消 | cancelled | 主动取消，需填写取消原因 |
| lost | 重新激活 | open | 同一客户下新建商机 |
| cancelled | 重新激活 | open | 取消后重新跟单 |

#### 4.3.2 公海池流转

**流转规则：**

| 当前状态 | 操作 | 目标状态 | 条件 |
|----------|------|----------|------|
| 正常客户 | 自动入公海 | 公海池 | 连续30天无跟进记录（可配置） |
| 公海池 | 认领 | 正常客户 | 销售主动认领 |

#### 4.3.3 任务状态流转

**流转规则：**

| 当前状态 | 操作 | 目标状态 | 条件 |
|----------|------|----------|------|
| pending | 开始处理 | inProgress | 负责人开始处理 |
| inProgress | 标记完成 | completed | 任务完成 |
| pending/inProgress | 逾期 | overdue | 超过截止日期未完成 |

---

#### 附录

### A. 变更记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| 1.0.0 | 2026-04-14 | 初始版本，基于 normal 场景 v1.0.0 方案生成 |
