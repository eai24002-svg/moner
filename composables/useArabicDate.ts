import {
  APP_TIME_ZONE,
  createCalendarDate,
  dateStringToDayNumber,
  getCurrentDateString,
  normalizeTimeString,
  parseDateParts,
  parseTimeParts
} from '~/utils/cinema-time'

const locale = 'ar-EG-u-ca-gregory-nu-latn'
const fallbackDateLabel = 'موعد قريب'
const fallbackTimeLabel = 'الوقت غير محدد'

const weekStart = (date: Date) => {
  const day = date.getUTCDay()
  const diff = (day + 6) % 7
  const target = new Date(date.getTime())
  target.setUTCDate(target.getUTCDate() - diff)
  return target
}

const diffInDays = (value: string) => {
  const target = dateStringToDayNumber(value)
  const today = dateStringToDayNumber(getCurrentDateString())
  if (target === null || today === null) return null
  return target - today
}

const sameWeek = (left: string, right: string) =>
  createCalendarDate(left) && createCalendarDate(right)
    ? weekStart(createCalendarDate(left) as Date).getTime() === weekStart(createCalendarDate(right) as Date).getTime()
    : false

const pad = (value: number) => String(value).padStart(2, '0')

export const useArabicDate = () => {
  const formatWeekday = (value: string) => {
    const parsed = createCalendarDate(value)
    if (!parsed) return fallbackDateLabel
    return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: APP_TIME_ZONE }).format(parsed)
  }

  const formatDayMonth = (value: string) => {
    const parsed = createCalendarDate(value)
    if (!parsed) return fallbackDateLabel
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', timeZone: APP_TIME_ZONE }).format(parsed)
  }

  const formatLongDate = (value: string) => {
    const parsed = createCalendarDate(value)
    if (!parsed) return fallbackDateLabel
    return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: APP_TIME_ZONE }).format(parsed)
  }

  const formatNumericDate = (value: string) => {
    const { day, month } = parseDateParts(value)
    if (!day || !month) return '--/--'
    return `${pad(day)}/${pad(month)}`
  }

  const formatTime = (value: string) => {
    const normalized = normalizeTimeString(value)
    if (!normalized) return fallbackTimeLabel

    const { hour, minute } = parseTimeParts(normalized)
    if (Number.isNaN(hour) || Number.isNaN(minute)) return fallbackTimeLabel
    const meridiem = hour >= 12 ? 'مساءً' : 'صباحًا'
    const displayHour = ((hour + 11) % 12) + 1
    return `${displayHour}:${pad(minute)} ${meridiem}`
  }

  const formatSmartDay = (value: string) => {
    const distance = diffInDays(value)
    const todayValue = getCurrentDateString()
    const currentWeek = sameWeek(value, todayValue)

    if (distance === null) return formatLongDate(value)
    if (distance === 0) return 'اليوم'
    if (distance === 1) return 'غدًا'
    if (distance === 2) return 'بعد غد'
    if (distance > 0 && currentWeek) return `${formatWeekday(value)} هذا الأسبوع`
    if (distance > 0 && distance <= 13) return `${formatWeekday(value)} الأسبوع القادم`
    return formatLongDate(value)
  }

  const formatUserFacingDate = (value: string) => {
    const distance = diffInDays(value)

    if (distance === null) return formatLongDate(value)
    if (distance === 0) return `اليوم، ${formatDayMonth(value)}`
    if (distance === 1) return `غدًا، ${formatDayMonth(value)}`
    return formatLongDate(value)
  }

  const formatDateSupportLabel = (value: string) => {
    const distance = diffInDays(value)

    if (distance === null) return 'موعد قادم'
    if (distance <= 1) return 'ضمن أقرب المواعيد'
    if (distance <= 6) return 'هذا الأسبوع'
    if (distance <= 13) return 'الأسبوع القادم'
    return 'موعد قادم'
  }

  const formatDateTime = (dateValue: string, timeValue: string) => `${formatUserFacingDate(dateValue)}، ${formatTime(timeValue)}`

  return {
    formatWeekday,
    formatDayMonth,
    formatLongDate,
    formatNumericDate,
    formatTime,
    formatSmartDay,
    formatUserFacingDate,
    formatDateSupportLabel,
    formatDateTime
  }
}
