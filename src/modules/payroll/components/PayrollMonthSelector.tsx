import { Link } from 'react-router-dom'
import { getCurrentPayrollMonth, getPayrollMonthLabel } from '../services/payrollCalculations'

type PayrollMonthSelectorProps = {
  selectedMonth: string
}

function shiftMonth(baseMonth: string, offset: number) {
  const [year, month] = baseMonth.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1 + offset, 1))
  return `${date.getUTCFullYear()}-${`${date.getUTCMonth() + 1}`.padStart(2, '0')}`
}

export function PayrollMonthSelector({ selectedMonth }: PayrollMonthSelectorProps) {
  const currentMonth = getCurrentPayrollMonth()
  const months = [shiftMonth(currentMonth, -1), currentMonth, shiftMonth(currentMonth, 1)]

  return (
    <div className="filter-row">
      {months.map((month) => (
        <Link
          key={month}
          className={`button ${selectedMonth === month ? 'button--primary' : 'button--secondary'} button--sm`}
          to={`/payroll/${month}`}
        >
          {getPayrollMonthLabel(month)}
        </Link>
      ))}
    </div>
  )
}
