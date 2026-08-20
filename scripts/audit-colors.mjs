import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const sourceRoot = path.resolve('src')
const colorPattern = /#[\da-f]{3,8}\b|rgba?\([^)]*\)/i
const sourceExtensions = new Set(['.vue', '.scss', '.ts'])

const allowedLinePatterns = [
  /box-shadow:/,
  /avatarColor:\s*['"]#/,
  /\bcolor:\s*['"]#/,
  /&\.(blue|red|violet)\s*\{/,
]

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const filePath = path.join(directory, entry.name)
      return entry.isDirectory() ? collectFiles(filePath) : [filePath]
    }),
  )

  return files.flat()
}

const files = (await collectFiles(sourceRoot)).filter(
  (filePath) => sourceExtensions.has(path.extname(filePath)) && !filePath.endsWith('tokens.scss'),
)

const violations = []

for (const filePath of files) {
  const lines = (await readFile(filePath, 'utf8')).split(/\r?\n/)
  let allowContentColors = false

  lines.forEach((line, index) => {
    if (line.includes('color-audit: allow-content-start')) {
      allowContentColors = true
      return
    }

    if (line.includes('color-audit: allow-content-end')) {
      allowContentColors = false
      return
    }

    if (allowContentColors) return

    if (!colorPattern.test(line) || allowedLinePatterns.some((pattern) => pattern.test(line)))
      return

    violations.push(`${path.relative(process.cwd(), filePath)}:${index + 1} ${line.trim()}`)
  })
}

if (violations.length > 0) {
  console.error('发现未使用主题令牌的界面颜色：')
  console.error(violations.join('\n'))
  process.exitCode = 1
} else {
  console.log('颜色审计通过：界面语义色均来自主题令牌。')
}
