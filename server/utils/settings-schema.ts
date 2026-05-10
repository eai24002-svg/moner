import { executeWrite, queryFirst } from '~/server/utils/db'

type ColumnCheck = { Field: string } | null

const hasColumn = async (columnName: string) => {
  const row = await queryFirst<ColumnCheck>(`SHOW COLUMNS FROM settings LIKE :columnName`, {
    columnName
  })

  return Boolean(row)
}

export const ensureSettingsSchema = async () => {
  const checks = await Promise.all([
    hasColumn('hero_badge'),
    hasColumn('hero_title_line_1'),
    hasColumn('hero_title_line_2'),
    hasColumn('hero_title_line_3'),
    hasColumn('hero_description')
  ])

  const statements: string[] = []

  if (!checks[0]) statements.push("ADD COLUMN hero_badge VARCHAR(255) NOT NULL DEFAULT 'ROWAIDA ART EXPERIENCE'")
  if (!checks[1]) statements.push("ADD COLUMN hero_title_line_1 VARCHAR(255) NOT NULL DEFAULT 'مساحة فنية راقية'")
  if (!checks[2]) statements.push("ADD COLUMN hero_title_line_2 VARCHAR(255) NOT NULL DEFAULT 'تجمع السينما والفعاليات'")
  if (!checks[3]) statements.push("ADD COLUMN hero_title_line_3 VARCHAR(255) NOT NULL DEFAULT 'بطابع مختلف تمامًا'")
  if (!checks[4]) {
    statements.push(
      "ADD COLUMN hero_description TEXT NOT NULL DEFAULT 'رويدة آرت ليست مجرد موقع عروض، بل واجهة أنيقة لتجربة متكاملة تضم أفلامًا مختارة، ورشًا إبداعية، وفعاليات بهوية بصرية هادئة وفاخرة.'"
    )
  }

  if (statements.length) {
    await executeWrite(`ALTER TABLE settings ${statements.join(', ')}`)
  }
}
