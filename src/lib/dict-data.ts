export interface DictItem {
  label: string
  value: string
  color?: string
}

export const dictionaries: Record<string, DictItem[]> = {
  // Customer level
  "dict-customer-level": [
    { label: "A类客户", value: "A", color: "red" },
    { label: "B类客户", value: "B", color: "orange" },
    { label: "C类客户", value: "C", color: "blue" },
  ],
  // Customer status
  "dict-customer-status": [
    { label: "跟进中", value: "active", color: "green" },
    { label: "久未跟进", value: "inactive", color: "gray" },
    { label: "已流失", value: "churned", color: "red" },
    // Legacy values kept for backward compat
    { label: "潜在客户", value: "potential", color: "blue" },
  ],
  // Contact importance
  "dict-contact-importance": [
    { label: "关键决策人", value: "key", color: "red" },
    { label: "有影响力", value: "influence", color: "orange" },
    { label: "普通联系人", value: "normal", color: "blue" },
  ],
  // Opportunity stage
  "dict-opportunity-stage": [
    { label: "线索", value: "lead", color: "gray" },
    { label: "初步接触", value: "initialContact", color: "blue" },
    { label: "技术交流", value: "technicalExchange", color: "purple" },
    { label: "商务谈判", value: "businessNegotiation", color: "orange" },
    { label: "合同签订", value: "contractSigned", color: "green" },
    { label: "回款完成", value: "paymentReceived", color: "green" },
  ],
  // Opportunity status
  "dict-opportunity-status": [
    { label: "进行中", value: "open", color: "blue" },
    { label: "赢单", value: "won", color: "green" },
    { label: "输单", value: "lost", color: "red" },
    { label: "已取消", value: "cancelled", color: "gray" },
  ],
  // Followup type
  "dict-followup-type": [
    { label: "拜访", value: "visit", color: "blue" },
    { label: "电话", value: "call", color: "purple" },
    { label: "会议", value: "meeting", color: "orange" },
    { label: "邮件", value: "email", color: "gray" },
    { label: "其他", value: "other", color: "gray" },
  ],
  // Task type
  "dict-task-type": [
    { label: "跟进任务", value: "followup", color: "blue" },
    { label: "技术交流", value: "technical", color: "purple" },
    { label: "审批任务", value: "approval", color: "orange" },
    { label: "交付任务", value: "delivery", color: "green" },
  ],
  // Task status
  "dict-task-status": [
    { label: "待处理", value: "pending", color: "blue" },
    { label: "进行中", value: "inProgress", color: "orange" },
    { label: "已完成", value: "completed", color: "green" },
    { label: "已逾期", value: "overdue", color: "red" },
  ],
  // Product line
  "dict-product-line": [
    { label: "整机", value: "machine", color: "blue" },
    { label: "配件", value: "parts", color: "orange" },
    { label: "再制造", value: "remanufacturing", color: "green" },
  ],
  // Industry (kept for legacy followup pages)
  "dict-customer-industry": [
    { label: "通用制造", value: "manufacturing", color: "blue" },
    { label: "汽车", value: "automotive", color: "purple" },
    { label: "电子", value: "electronics", color: "orange" },
    { label: "机械设备", value: "machinery", color: "blue" },
    { label: "新能源", value: "energy", color: "green" },
  ],
  // Legacy dicts for existing followup pages
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
