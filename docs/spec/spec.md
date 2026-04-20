> **版本**：1.0.0 | **状态**：draft | **更新时间**：2026-04-20

> **来源方案**：normal 场景 v0.1 版本

---

#### 约定说明

本文档使用以下标准值：
- **布局类型**: `list` / `detail` / `form` / `dashboard` / `steps` / `custom`
- **区块类型**: `table` / `form` / `card` / `cards` / `chart` / `tabs` / `steps` / `timeline` / `description` / `statistic` / `custom`
- **字段类型**: `text` / `textarea` / `number` / `money` / `percent` / `date` / `datetime` / `daterange` / `select` / `multiselect` / `switch` / `upload` 等

---

#### 一、产品概述

### 1.1 项目背景

国彩真空在温州从事真空镀膜设备制造，主打卷对卷磁控溅射镀膜机、PVD离子镀膜机等非标定制设备，客户分布在包装、五金、眼镜镜片、电子元器件等行业。B2B 销售，订单基本为定制，销售链条长、节点多。当前客户信息和订单跟进完全依赖销售个人手机和微信，老板看不到全局。本期聚焦搭建统一的客户和订单管理体系，让老板和销售都能"看得见"。

### 1.2 产品目标

- 建立统一的客户档案库，客户信息不随销售离职而流失
- 实现商机全生命周期管理，提高销售转化率
- 打通订单全流程，让交期状态对客户和销售均透明可见
- 老板随时通过手机查看签约金额、回款进度、商机 Pipeline 和订单交付情况

### 1.3 目标用户

| 角色 | 描述 | 核心诉求 |
|------|------|----------|
| 老板 | 公司创始人/管理者 | 随时看到全局：所有客户、所有订单、团队业绩 |
| 销售 | 一线业务人员 | 管理自己负责的客户和商机，减少催单答复工作 |
| 客户 | 采购/技术负责人 | 随时查看订单当前状态，减少反复催单 |

### 1.4 范围定义

**本期包含：**

- 客户管理：统一档案库、公海池机制、查重与合并、流失预警
- 商机管理：自定义销售阶段、商机卡片、转化漏斗视图、超期预警
- 订单管理：全流程状态机、非标设备特殊字段、客户查看端、节点通知
- 老板销售看板：核心指标卡、商机 Pipeline、订单交付进度、销售排名
- 移动端适配：微信小程序或 H5 页面，支持手机端操作

**本期不含：**

- 非标设备报价管理（P1 需求，报价依赖经验，一期待业务模式稳定后再扩展）
- 回款与应收账款跟踪（P1 需求，一期聚焦客户和订单主流程，资金模块后续扩展）
- 合同全生命周期管理（P1 需求，与订单管理强关联，一期简化处理）
- 客户运营与复购提醒（P2 需求，需先积累足够客户数据后再启用）
- 生产排产与工序管理（非标设备排产逻辑复杂，需单独评估，一期仅管理订单状态）
- 出厂质检记录数字化（现场扫码等硬件配套，一期待人工记录）

---

#### 二、信息架构

### 2.1 站点地图

- 销售看板（icon: LayoutDashboard）
  - 首页看板 → `/dashboard`
- 客户管理（icon: Users）
  - 客户列表 → `/customers`
  - 公海池 → `/customers/public-pool`
  - 客户详情 → `/customers/:id`
  - 新建/编辑客户 → `/customers/new`、`/customers/:id/edit`
- 商机管理（icon: TrendingUp）
  - 商机列表 → `/opportunities`
  - 商机详情 → `/opportunities/:id`
  - 新建商机 → `/opportunities/new`
- 订单管理（icon: ClipboardList）
  - 订单列表 → `/orders`
  - 订单详情 → `/orders/:id`
  - 新建订单 → `/orders/new`

### 2.2 导航结构

| 一级菜单 | 二级菜单 | 路由 | 说明 |
|----------|----------|------|------|
| 销售看板 | 首页看板 | `/dashboard` | 老板视图，展示核心业绩指标 |
| 客户管理 | 客户列表 | `/customers` | 销售查看和编辑负责的客户 |
| 客户管理 | 公海池 | `/customers/public-pool` | 未分配客户统一入口 |
| 商机管理 | 商机列表 | `/opportunities` | 所有商机的筛选和汇总 |
| 订单管理 | 订单列表 | `/orders` | 所有订单的状态和进度管理 |

---

#### 三、功能模块

### 3.1 客户管理

> 客户信息分散在销售个人手机中，离职即流失。本模块将客户档案集中入库，通过公海池机制避免撞单，沉淀企业客户资产。

#### 3.1.1 客户列表页

**路由**：`/customers`
**布局**：`list`
**描述**：展示全部客户列表，支持按行业、负责人筛选，支持新增客户。

##### 筛选条件（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 关键词 | keyword | text | 否 | 搜索客户名称、联系人 |
| 行业 | industry | select | 否 | 选项来源: dict-industry |
| 负责销售 | ownerId | select | 否 | 下拉选择销售人员 |
| 客户等级 | level | select | 否 | 选项来源: dict-customer-level |

##### 数据列表（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 客户名称 | name | text | 是 |  |
| 行业 | industry | tag | 否 |  |
| 联系人 | primaryContact | text | 否 | 主联系人姓名 |
| 手机 | phone | text | 否 | 主联系人手机 |
| 负责销售 | ownerName | text | 是 |  |
| 客户等级 | level | tag | 否 |  |
| 最近跟进 | lastFollowUpAt | date | 是 |  |
| 操作 | actions | action | 否 | 查看、编辑 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 新建客户 | primary | toolbar-right | navigate to `/customers/new` |
| 导出 | default | toolbar-left | download |
| 查看 | link | row | navigate to `/customers/:id` |
| 编辑 | link | row | navigate to `/customers/:id/edit` |

##### 业务规则

- 销售只能看到自己负责的客户（ownerId = 当前用户），老板可见全部
- 新建客户时未指定负责人，自动进入公海池
- 系统自动识别重复客户并提示合并

---

#### 3.1.2 公海池页

**路由**：`/customers/public-pool`
**布局**：`list`
**描述**：展示未分配负责人的客户列表，管理员可将客户分配给对应销售。

##### 数据列表（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 客户名称 | name | text | 是 |  |
| 行业 | industry | tag | 否 |  |
| 来源 | source | tag | 否 | 如展会录入、官网线索等 |
| 进入公海时间 | pooledAt | date | 是 |  |
| 操作 | actions | action | 否 | 分配、查看 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 分配 | default | row | modal 选择负责销售 |
| 批量分配 | default | toolbar | modal 批量选择负责销售 |
| 查看 | link | row | navigate to `/customers/:id` |

##### 业务规则

- 仅老板和销售助理角色可访问公海池
- 分配后客户从公海池移除，进入对应销售的客户列表

---

#### 3.1.3 客户详情页

**路由**：`/customers/:id`
**布局**：`detail`
**描述**：展示完整客户档案，含基本信息、联系人、沟通记录。

##### 基本信息（description）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 客户名称 | name | text |  |
| 行业 | industry | select | 选项来源: dict-industry |
| 规模 | scale | select | 选项来源: dict-company-scale |
| 地址 | address | text |  |
| 网址 | website | text |  |
| 客户等级 | level | select | 选项来源: dict-customer-level |
| 负责销售 | ownerName | text |  |
| 创建时间 | createdAt | datetime |  |

##### 联系人列表（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 姓名 | name | text | 否 |  |
| 职位 | title | text | 否 |  |
| 手机 | phone | text | 否 |  |
| 邮箱 | email | text | 否 |  |
| 是否主联系人 | isPrimary | switch | 否 |  |

##### 沟通记录（timeline）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 沟通时间 | occurredAt | datetime |  |
| 沟通方式 | type | select | 电话/拜访/线上沟通/其他 |
| 内容摘要 | summary | textarea |  |
| 负责人 | ownerName | text |  |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 编辑 | default | toolbar | navigate to `/customers/:id/edit` |
| 新建商机 | primary | card-footer | navigate to `/opportunities/new?customerId=:id` |
| 新建订单 | default | card-footer | navigate to `/orders/new?customerId=:id` |
| 添加联系人 | default | card | drawer 打开联系人表单 |
| 记录跟进 | default | card | drawer 打开跟进记录表单 |

##### 业务规则

- 客户等级为高价值且超过 30 天未跟进，系统自动提醒重新分配
- 主联系人手机和邮箱用于订单通知推送

---

#### 3.1.4 新建/编辑客户页

**路由**：`/customers/new`、`/customers/:id/edit`
**布局**：`form`
**描述**：新建或编辑客户档案。

##### 基本信息（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 客户名称 | name | text | 是 |  |
| 行业 | industry | select | 否 | 选项来源: dict-industry |
| 规模 | scale | select | 否 | 选项来源: dict-company-scale |
| 地址 | address | text | 否 |  |
| 网址 | website | text | 否 |  |
| 客户等级 | level | select | 否 | 选项来源: dict-customer-level |
| 负责销售 | ownerId | select | 否 | 为空则自动进入公海池 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 保存 | primary | form-footer | action 保存并返回列表 |
| 取消 | default | form-footer | navigate back |

##### 业务规则

- 必填字段：客户名称
- ownerId 为空时提交后自动进入公海池并通知销售助理
- 编辑时不允许将 ownerId 置空，防止客户意外进公海

---

### 3.2 商机管理

> 商机跟进靠记忆，转化率低，阶段不透明。本模块通过标准销售漏斗管理商机，自动统计各阶段转化率，超期未推进自动预警。

#### 3.2.1 商机列表页

**路由**：`/opportunities`
**布局**：`list`
**描述**：展示所有商机，支持按阶段、负责人筛选，展示漏斗汇总数据。

##### 筛选条件（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 关键词 | keyword | text | 否 | 搜索商机名称或客户名 |
| 销售阶段 | stage | select | 否 | 选项来源: dict-opportunity-stage |
| 负责销售 | ownerId | select | 否 | 下拉选择 |
| 预计签约日期 | expectedCloseDate | daterange | 否 |  |

##### 数据列表（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 商机名称 | name | text | 是 |  |
| 关联客户 | customerName | link | 否 | 点击跳转客户详情 |
| 负责销售 | ownerName | text | 是 |  |
| 金额 | amount | money | 是 | 预计签约金额 |
| 当前阶段 | stage | status | 是 | 颜色对应 dict-opportunity-stage |
| 预计签约日期 | expectedCloseDate | date | 是 |  |
| 跟进天数 | followUpDays | number | 否 | 超过阈值显示预警色 |
| 操作 | actions | action | 否 | 查看、编辑 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 新建商机 | primary | toolbar-right | navigate to `/opportunities/new` |
| 漏斗视图 | default | toolbar-left | 切换为 chart 模式展示各阶段金额分布 |

##### 业务规则

- 销售只能看到自己负责的商机，老板可见全部
- 跟进天数超过 15 天未变更阶段，行标红预警
- 漏斗视图按阶段分组显示商机数量和金额汇总

---

#### 3.2.2 商机详情页

**路由**：`/opportunities/:id`
**布局**：`detail`
**描述**：展示商机完整信息，支持阶段推进和附件上传。

##### 商机概览（description）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 商机名称 | name | text |  |
| 关联客户 | customerName | link | 跳转客户详情 |
| 负责销售 | ownerName | text |  |
| 金额 | amount | money | 预计签约金额 |
| 当前阶段 | stage | status | 选项来源: dict-opportunity-stage |
| 预计签约日期 | expectedCloseDate | date |  |
| 创建时间 | createdAt | datetime |  |
| 更新时间 | updatedAt | datetime |  |

##### 阶段历史（timeline）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 阶段名称 | stage | text |  |
| 进入时间 | enteredAt | datetime |  |
| 备注 | note | textarea |  |

##### 附件（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 文件名 | fileName | text | 否 |  |
| 类型 | fileType | tag | 否 |  |
| 上传时间 | uploadedAt | datetime | 否 |  |
| 上传人 | uploaderName | text | 否 |  |
| 操作 | actions | action | 否 | 下载、删除 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 编辑 | default | toolbar | navigate to `/opportunities/:id/edit` |
| 推进阶段 | primary | card | modal 选择下一阶段 |
| 上传附件 | default | card | upload 组件 |
| 转为订单 | default | card-footer | navigate to `/orders/new?opportunityId=:id` |

##### 业务规则

- 阶段只能按预设顺序推进，不可跳阶段
- 推进阶段时须填写备注，记录推进原因
- 转为订单后，商机状态自动变更为已签约

---

#### 3.2.3 新建/编辑商机页

**路由**：`/opportunities/new`、`/opportunities/:id/edit`
**布局**：`form`
**描述**：新建或编辑商机。

##### 商机信息（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 商机名称 | name | text | 是 |  |
| 关联客户 | customerId | select | 是 | 下拉选择已有客户 |
| 负责销售 | ownerId | select | 是 | 下拉选择 |
| 金额 | amount | money | 是 | 预计签约金额 |
| 销售阶段 | stage | select | 是 | 选项来源: dict-opportunity-stage，默认为需求确认 |
| 预计签约日期 | expectedCloseDate | date | 否 |  |
| 备注 | note | textarea | 否 |  |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 保存 | primary | form-footer | action 保存并返回列表 |
| 取消 | default | form-footer | navigate back |

##### 业务规则

- 必填：商机名称、关联客户、负责销售、金额、阶段
- 新建时默认阶段为需求确认

---

### 3.3 订单管理

> 订单靠微信跟进，交期状态客户不知道，反复催单。本模块实现订单全流程可视化，关键节点自动通知，客户可通过链接查看当前状态。

#### 3.3.1 订单列表页

**路由**：`/orders`
**布局**：`list`
**描述**：展示所有订单，支持按状态和客户筛选，展示各状态订单数量汇总。

##### 筛选条件（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 关键词 | keyword | text | 否 | 搜索订单号或客户名 |
| 订单状态 | status | select | 否 | 选项来源: dict-order-status |
| 客户 | customerId | select | 否 | 下拉选择 |

##### 数据列表（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 订单号 | orderNo | text | 是 | 系统自动生成 |
| 客户名称 | customerName | link | 否 | 点击跳转客户详情 |
| 订单金额 | amount | money | 是 |  |
| 当前状态 | status | status | 是 | 颜色对应 dict-order-status |
| 签约日期 | signedAt | date | 是 |  |
| 预计交付 | expectedDeliveryDate | date | 否 | 超期显示预警色 |
| 操作 | actions | action | 否 | 查看 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 新建订单 | primary | toolbar-right | navigate to `/orders/new` |
| 导出 | default | toolbar-left | download |

##### 业务规则

- 销售只能看到自己客户的订单，老板可见全部
- 预计交付日期超期未完成，行标红预警

---

#### 3.3.2 订单详情页

**路由**：`/orders/:id`
**布局**：`detail`
**描述**：展示订单完整信息，包括状态流转节点和定制要求。

##### 订单概览（description）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 订单号 | orderNo | text |  |
| 关联客户 | customerName | link | 跳转客户详情 |
| 关联商机 | opportunityName | link | 跳转商机详情，可为空 |
| 订单金额 | amount | money |  |
| 当前状态 | status | status | 选项来源: dict-order-status |
| 签约日期 | signedAt | date |  |
| 预计交付日期 | expectedDeliveryDate | date |  |
| 实际交付日期 | actualDeliveryDate | date | 状态为验收后自动填充 |

##### 状态流转（steps）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 当前步骤 | currentStep | text |  |
| 步骤列表 | steps | steps | 签约→生产排期→生产中→质检→发货→安装调试→验收 |

##### 非标设备信息（card）

| 字段 | fieldKey | 类型 | 说明 |
|------|----------|------|------|
| 设备类型 | equipmentType | text | 如卷对卷磁控溅射镀膜机 |
| 技术规格 | techSpecs | textarea | 非标定制技术要求 |
| 定制要求 | customRequirements | textarea | 客户特殊定制需求 |
| 验收标准 | acceptanceCriteria | textarea | 设备验收依据 |
| 技术方案附件 | techAttachment | upload | 上传技术方案 PDF 等 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 编辑 | default | toolbar | navigate to `/orders/:id/edit` |
| 推进状态 | primary | card | modal 选择下一状态并填写备注 |
| 复制查看链接 | default | card | 将客户查看端链接复制到剪贴板 |

##### 业务规则

- 状态只能按预设顺序推进，不可跳状态
- 推进至发货时，系统自动生成客户查看链接并通知客户
- 推进至验收时，自动填充 actualDeliveryDate

---

#### 3.3.3 新建/编辑订单页

**路由**：`/orders/new`、`/orders/:id/edit`
**布局**：`form`
**描述**：新建或编辑订单。

##### 订单信息（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 关联客户 | customerId | select | 是 | 下拉选择已有客户 |
| 关联商机 | opportunityId | select | 否 | 可选，关联后自动填充金额 |
| 订单金额 | amount | money | 是 |  |
| 签约日期 | signedAt | date | 是 |  |
| 预计交付日期 | expectedDeliveryDate | date | 是 |  |

##### 非标设备信息（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 设备类型 | equipmentType | text | 否 |  |
| 技术规格 | techSpecs | textarea | 否 |  |
| 定制要求 | customRequirements | textarea | 否 |  |
| 验收标准 | acceptanceCriteria | textarea | 否 |  |
| 技术方案附件 | techAttachment | upload | 否 | 支持 PDF、图片等 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 保存 | primary | form-footer | action 保存并返回列表 |
| 取消 | default | form-footer | navigate back |

##### 业务规则

- 必填：关联客户、订单金额、签约日期、预计交付日期
- 新建时默认状态为签约
- 订单号由系统自动生成

---

### 3.4 老板销售看板

> 老板看不到全局，不清楚团队在干什么。本模块在手机端集中展示核心业绩指标，让老板随时随地掌握全局。

#### 3.4.1 首页看板

**路由**：`/dashboard`
**布局**：`dashboard`
**描述**：老板视图首页，展示核心业绩指标和团队销售情况。

##### 核心指标（statistic）

| 指标 | fieldKey | 说明 |
|------|----------|------|
| 本月签约金额 | monthSignAmount | 当月签约订单金额合计 |
| 本季度签约金额 | quarterSignAmount | 当季度签约订单金额合计 |
| 本月回款金额 | monthCollectAmount | 当月回款金额合计 |
| 应收账款总额 | totalReceivable | 所有未结清订单应收款合计 |

##### 签约金额趋势（chart）

| 图表 | 类型 | 数据说明 |
|------|------|----------|
| 近6个月签约金额趋势 | line | X轴为月份，Y轴为签约金额，按月统计 |

##### 商机 Pipeline（chart）

| 图表 | 类型 | 数据说明 |
|------|------|----------|
| 各阶段商机分布 | bar | 按销售阶段分组，显示商机数量和金额 |

##### 订单交付进度（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 状态 | status | status | 否 | 选项来源: dict-order-status |
| 订单数 | orderCount | number | 是 | 该状态订单数量 |
| 金额合计 | totalAmount | money | 是 | 该状态订单金额合计 |
| 交付预警 | warningCount | number | 否 | 超期未交付订单数 |

##### 销售排名（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 排名 | rank | number | 是 | 按签约金额倒序 |
| 编号 | repCode | text | 否 | 展示编号而非真实姓名 |
| 本月签约 | monthSignAmount | money | 是 |  |
| 商机数量 | opportunityCount | number | 否 | 当前跟进中商机数 |

##### 业务规则

- 仅老板和销售助理角色可访问
- 页面数据按日更新，支持下拉刷新
- 销售排名默认展示编号，可配置切换为真实姓名

---

#### 四、全局规则

### 4.1 角色权限

| 角色 | 描述 | 模块权限 |
|------|------|----------|
| 老板 | 公司管理者 | 可见全部客户、商机和订单；可访问销售看板；可管理公海池 |
| 销售 | 一线业务人员 | 只能看到自己负责的客户和商机；可管理自己客户的订单 |
| 销售助理 | 协助老板管理 | 可访问公海池；可帮助分配客户；可查看全部数据 |

### 4.2 数据字典

#### 4.2.1 客户行业（dict-industry）

| 值 | 显示 | 颜色 |
|----|------|------|
| packaging | 包装 | #6366f1 |
| hardware | 五金 | #8b5cf6 |
| eyewear | 眼镜镜片 | #06b6d4 |
| electronics | 电子元器件 | #f59e0b |
| other | 其他 | #94a3b8 |

#### 4.2.2 客户等级（dict-customer-level）

| 值 | 显示 | 颜色 |
|----|------|------|
| high | 高价值 | #ef4444 |
| medium | 中价值 | #f59e0b |
| low | 普通 | #94a3b8 |

#### 4.2.3 企业规模（dict-company-scale）

| 值 | 显示 | 颜色 |
|----|------|------|
| small | 小型（50人以下） | #22c55e |
| medium | 中型（50-200人） | #3b82f6 |
| large | 大型（200人以上） | #8b5cf6 |

#### 4.2.4 商机销售阶段（dict-opportunity-stage）

| 值 | 显示 | 颜色 |
|----|------|------|
| demand_confirmed | 需求确认 | #3b82f6 |
| scheme_evaluating | 方案评估 | #8b5cf6 |
| tech_reviewing | 技术对接 | #06b6d4 |
| business_negotiating | 商务谈判 | #f59e0b |
| signed | 已签约 | #22c55e |

#### 4.2.5 订单状态（dict-order-status）

| 值 | 显示 | 颜色 |
|----|------|------|
| signed | 签约 | #3b82f6 |
| production_planning | 生产排期 | #8b5cf6 |
| in_production | 生产中 | #06b6d4 |
| quality_check | 质检 | #f59e0b |
| shipped | 发货 | #22c55e |
| installing | 安装调试 | #14b8a6 |
| accepted | 验收 | #10b981 |

### 4.3 状态流转

#### 4.3.1 商机状态流转

**状态定义：**

| 状态 | 显示 | 颜色 | 说明 |
|------|------|------|------|
| demand_confirmed | 需求确认 | #3b82f6 | 初步确认客户需求 |
| scheme_evaluating | 方案评估 | #8b5cf6 | 客户评估技术方案 |
| tech_reviewing | 技术对接 | #06b6d4 | 技术细节沟通 |
| business_negotiating | 商务谈判 | #f59e0b | 价格和合同条款谈判 |
| signed | 已签约 | #22c55e | 合同签署，商机结束 |

**流转规则：**

| 当前状态 | 操作 | 目标状态 | 条件 |
|----------|------|----------|------|
| 需求确认 | 推进 | 方案评估 | 填写推进备注 |
| 方案评估 | 推进 | 技术对接 | 填写推进备注 |
| 技术对接 | 推进 | 商务谈判 | 填写推进备注 |
| 商务谈判 | 推进 | 已签约 | 填写推进备注，关联订单 |

#### 4.3.2 订单状态流转

**状态定义：**

| 状态 | 显示 | 颜色 | 说明 |
|------|------|------|------|
| signed | 签约 | #3b82f6 | 合同签署完成 |
| production_planning | 生产排期 | #8b5cf6 | 内部生产计划排定 |
| in_production | 生产中 | #06b6d4 | 生产制造进行中 |
| quality_check | 质检 | #f59e0b | 出厂质量检验 |
| shipped | 发货 | #22c55e | 设备已发出 |
| installing | 安装调试 | #14b8a6 | 现场安装和调试 |
| accepted | 验收 | #10b981 | 客户确认验收完成 |

**流转规则：**

| 当前状态 | 操作 | 目标状态 | 条件 |
|----------|------|----------|------|
| 签约 | 排产 | 生产排期 | 选择生产负责人 |
| 生产排期 | 开始生产 | 生产中 | 填写实际开始时间 |
| 生产中 | 提交质检 | 质检 | 上传质检记录附件（可选项） |
| 质检 | 发货 | 发货 | 填写物流信息 |
| 发货 | 开始安装 | 安装调试 | 记录到场时间 |
| 安装调试 | 完成验收 | 验收 | 客户线上确认或签字 |

---

#### 附录

### A. 变更记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| 1.0.0 | 2026-04-20 | 初始版本，基于 normal 场景 v0.1 方案生成 |
