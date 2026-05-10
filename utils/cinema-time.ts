const dayInMs = 24 * 60 * 60 * 1000

export const APP_TIME_ZONE = 'Asia/Baghdad'

const pad = (value: number) => String(value).padStart(2, '0')

export const parseDateParts = (value: string | null | undefined) => {
  const normalized = normalizeDateString(value)
  const [year = '0', month = '0', day = '0'] = normalized.split('-')

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day)
  }
}

export const parseTimeParts = (value: string | null | undefined) => {
  const normalized = normalizeTimeString(value)
  const [hour = '0', minute = '0', second = '0'] = normalized.split(':')

  return {
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second)
  }
}

export const normalizeDateString = (value: string | null | undefined) => {
  if (!value) return ''

  const trimmed = String(value).trim()
  const directMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (directMatch) {
    return `${directMatch[1]}-${directMatch[2]}-${directMatch[3]}`
  }

  const parsed = new Date(trimmed)

  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`
}

export const normalizeTimeString = (value: string | null | undefined) => {
  if (!value) return ''

  const trimmed = String(value).trim()
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)

  if (!match) {
    return ''
  }

  const hour = Number(match[1])
  const minute = Number(match[2])
  const second = Number(match[3] || '0')

  if ([hour, minute, second].some((part) => Number.isNaN(part))) {
    return ''
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
    return ''
  }

  return `${pad(hour)}:${pad(minute)}:${pad(second)}`
}

const getFormatterParts = (now: Date, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  })

  return formatter
    .formatToParts(now)
    .reduce<Record<string, string>>((parts, part) => {
      if (part.type !== 'literal') {
        parts[part.type] = part.value
      }

      return parts
    }, {})
}

export const getCurrentDateString = (now = new Date(), timeZone = APP_TIME_ZONE) => {
  const parts = getFormatterParts(now, timeZone)
  return `${parts.year}-${parts.month}-${parts.day}`
}

export const getCurrentTimeString = (now = new Date(), timeZone = APP_TIME_ZONE) => {
  const parts = getFormatterParts(now, timeZone)
  return `${parts.hour}:${parts.minute}:${parts.second}`
}

export const addDaysToDateString = (value: string, daysToAdd: number) => {
  const { year, month, day } = parseDateParts(value)
  const date = new Date(Date.UTC(year, month - 1, day + daysToAdd))

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

export const getUtcWeekdayIndex = (value: string | null | undefined) => {
  const normalized = normalizeDateString(value)
  if (!normalized) return null
  const { year, month, day } = parseDateParts(normalized)
  const utc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
  return Number.isNaN(utc.getTime()) ? null : utc.getUTCDay()
}

export const createCalendarDate = (value: string | null | undefined) => {
  const normalized = normalizeDateString(value)

  if (!normalized) {
    return null
  }

  const { year, month, day } = parseDateParts(normalized)
  const parsed = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const dateStringToDayNumber = (value: string | null | undefined) => {
  const normalized = normalizeDateString(value)

  if (!normalized) {
    return null
  }

  const { year, month, day } = parseDateParts(normalized)
  return Math.floor(Date.UTC(year, month - 1, day) / dayInMs)
}

export const isShowtimeExpired = (showDate: string, showTime: string, now = new Date(), timeZone = APP_TIME_ZONE) => {
  const normalizedDate = normalizeDateString(showDate)
  const normalizedTime = normalizeTimeString(showTime)

  if (!normalizedDate || !normalizedTime) {
    return false
  }

  const currentDate = getCurrentDateString(now, timeZone)

  if (normalizedDate < currentDate) {
    return true
  }

  if (normalizedDate > currentDate) {
    return false
  }

  return normalizedTime <= getCurrentTimeString(now, timeZone)
}
