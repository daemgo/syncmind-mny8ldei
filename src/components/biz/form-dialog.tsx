import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDictOptions } from "@/lib/dict"

// --- Public types ---

export interface FormField {
  key: string
  label: string
  type: "text" | "textarea" | "number" | "select" | "date"
  /** For select type: dict ID to load options (static) */
  dictId?: string
  /** For select type: dynamic options (takes precedence over dictId) */
  options?: { label: string; value: string }[]
  required?: boolean
  placeholder?: string
  /** Span full width (col-span-2 in two-column layout) */
  fullWidth?: boolean
}

interface FormDialogProps<T> {
  /** Entity display name (e.g. "客户", "商机") */
  entityName: string
  fields: FormField[]
  /** undefined = create mode, object = edit mode (pre-fill) */
  data?: T
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (formData: Record<string, string>) => void
}

// --- Component ---

export function FormDialog<T extends Record<string, unknown>>({
  entityName,
  fields,
  data,
  open,
  onOpenChange,
  onSubmit,
}: FormDialogProps<T>) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const isEdit = !!data

  // Sync form state when dialog opens
  useEffect(() => {
    if (open) {
      if (data) {
        const initial: Record<string, string> = {}
        fields.forEach((f) => {
          initial[f.key] = String(data[f.key] ?? "")
        })
        setFormData(initial)
      } else {
        setFormData({})
      }
    }
  }, [open, data, fields])

  function updateField(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit() {
    onSubmit?.(formData)
    onOpenChange(false)
  }

  // Two-column layout for forms with more than 6 fields
  const useGrid = fields.length > 6

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={useGrid ? "max-w-2xl" : "max-w-lg"}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑" : "新建"}{entityName}</DialogTitle>
        </DialogHeader>

        <div className={`py-4 max-h-[65vh] overflow-y-auto pr-1 ${useGrid ? "grid grid-cols-2 gap-x-6 gap-y-4" : "grid gap-4"}`}>
          {fields.map((field) => {
            const isFullWidth = field.fullWidth || field.type === "textarea"
            return (
              <div
                key={field.key}
                className={`flex flex-col gap-1.5 ${useGrid && isFullWidth ? "col-span-2" : ""}`}
              >
                <Label className="text-sm">
                  {field.required && <span className="mr-0.5 text-destructive">*</span>}
                  {field.label}
                </Label>
                {field.type === "text" && (
                  <Input
                    value={formData[field.key] ?? ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder ?? `请输入${field.label}`}
                  />
                )}
                {field.type === "textarea" && (
                  <Textarea
                    value={formData[field.key] ?? ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder ?? `请输入${field.label}`}
                    rows={3}
                  />
                )}
                {field.type === "number" && (
                  <Input
                    type="number"
                    value={formData[field.key] ?? ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder ?? `请输入${field.label}`}
                  />
                )}
                {field.type === "select" && (
                  <Select
                    value={formData[field.key] ?? ""}
                    onValueChange={(v) => updateField(field.key, v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder ?? `请选择${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options ?? (field.dictId ? getDictOptions(field.dictId) : [])).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {field.type === "date" && (
                  <Input
                    type="date"
                    value={formData[field.key] ?? ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                  />
                )}
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
