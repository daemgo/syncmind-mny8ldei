export interface DictItem {
  label: string
  value: string
  color?: string
}

export const dictionaries: Record<string, DictItem[]> = {
  // Customer industry (dict-industry)
  "dict-industry": [
    { label: "包装", value: "packaging", color: "blue" },
    { label: "五金", value: "hardware", color: "purple" },
    { label: "眼镜镜片", value: "eyewear", color: "cyan" },
    { label: "电子元器件", value: "electronics", color: "amber" },
    { label: "其他", value: "other", color: "gray" },
  ],
  // Customer level (dict-customer-level)
  "dict-customer-level": [
    { label: "高价值", value: "high", color: "red" },
    { label: "中价值", value: "medium", color: "amber" },
    { label: "普通", value: "low", color: "gray" },
  ],
  // Company scale (dict-company-scale)
  "dict-company-scale": [
    { label: "小型（50人以下）", value: "small", color: "green" },
    { label: "中型（50-200人）", value: "medium", color: "blue" },
    { label: "大型（200人以上）", value: "large", color: "purple" },
  ],
  // Opportunity stage (dict-opportunity-stage)
  "dict-opportunity-stage": [
    { label: "需求确认", value: "demand_confirmed", color: "blue" },
    { label: "方案评估", value: "scheme_evaluating", color: "purple" },
    { label: "技术对接", value: "tech_reviewing", color: "cyan" },
    { label: "商务谈判", value: "business_negotiating", color: "amber" },
    { label: "已签约", value: "signed", color: "green" },
  ],
  // Order status (dict-order-status)
  "dict-order-status": [
    { label: "签约", value: "signed", color: "blue" },
    { label: "生产排期", value: "production_planning", color: "purple" },
    { label: "生产中", value: "in_production", color: "cyan" },
    { label: "质检", value: "quality_check", color: "amber" },
    { label: "发货", value: "shipped", color: "green" },
    { label: "安装调试", value: "installing", color: "teal" },
    { label: "验收", value: "accepted", color: "green" },
  ],
  // Customer source
  "dict-customer-source": [
    { label: "官网线索", value: "website", color: "blue" },
    { label: "展会", value: "exhibition", color: "purple" },
    { label: "客户推荐", value: "referral", color: "green" },
    { label: "电话营销", value: "cold_call", color: "amber" },
    { label: "其他", value: "other", color: "gray" },
  ],
  // Followup type
  "dict-followup-type": [
    { label: "电话", value: "call", color: "blue" },
    { label: "拜访", value: "visit", color: "purple" },
    { label: "线上沟通", value: "online", color: "cyan" },
    { label: "其他", value: "other", color: "gray" },
  ],
  // Sales rep (for ownerId select)
  "dict-sales-rep": [
    { label: "张磊", value: "rep-001", color: "blue" },
    { label: "李婷", value: "rep-002", color: "purple" },
    { label: "王强", value: "rep-003", color: "cyan" },
    { label: "赵敏", value: "rep-004", color: "amber" },
    { label: "孙凯", value: "rep-005", color: "green" },
  ],
}
