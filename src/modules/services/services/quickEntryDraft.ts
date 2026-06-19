export type QuickEntryDraft = {
  workerId: string
  propertyId: string
  date: string
  startTime: string
  endTime: string
  hoursWorked: number
  hourlyRate?: number
  extraAmount?: number
  deductions?: number
  notes: string
}

export function createQuickEntryDraft(params?: Partial<QuickEntryDraft>): QuickEntryDraft {
  return {
    workerId: params?.workerId ?? '',
    propertyId: params?.propertyId ?? '',
    date: params?.date ?? new Date().toISOString().slice(0, 10),
    startTime: params?.startTime ?? '',
    endTime: params?.endTime ?? '',
    hoursWorked: params?.hoursWorked ?? 2,
    hourlyRate: params?.hourlyRate,
    extraAmount: params?.extraAmount,
    deductions: params?.deductions,
    notes: params?.notes ?? '',
  }
}
