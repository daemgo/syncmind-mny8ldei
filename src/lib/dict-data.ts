export interface DictItem {
  label: string
  value: string
  color?: string
}

export const dictionaries: Record<string, DictItem[]> = {
  "dict-customer-status": [
    { label: "潜在客户", value: "potential", color: "blue" },
    { label: "活跃客户", value: "active", color: "green" },
    { label: "沉默客户", value: "inactive", color: "yellow" },
    { label: "流失客户", value: "churned", color: "red" },
  ],
  "dict-customer-industry": [
    { label: "通用制造", value: "manufacturing", color: "blue" },
    { label: "汽车", value: "automotive", color: "purple" },
    { label: "电子", value: "electronics", color: "orange" },
    { label: "机械设备", value: "machinery", color: "cyan" },
    { label: "新能源", value: "energy", color: "green" },
  ],
  "dict-followup-type": [
    { label: "拜访", value: "visit", color: "blue" },
    { label: "电话", value: "call", color: "green" },
    { label: "会议", value: "meeting", color: "purple" },
    { label: "邮件", value: "email", color: "yellow" },
    { label: "其他", value: "other", color: "gray" },
  ],
  "dict-followup-result": [
    { label: "积极", value: "positive", color: "green" },
    { label: "中性", value: "neutral", color: "yellow" },
    { label: "消极", value: "negative", color: "red" },
    { label: "待定", value: "pending", color: "gray" },
  ],
  "dict-followup-stage": [
    { label: "需求确认", value: "qualify", color: "blue" },
    { label: "方案报价", value: "proposal", color: "orange" },
    { label: "合同谈判", value: "negotiation", color: "purple" },
    { label: "已成交", value: "closed", color: "green" },
  ],
}
