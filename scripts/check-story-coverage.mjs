import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const componentsRoot = path.join(repoRoot, 'src', 'components')

const walkFiles = (directory) => {
  const entries = readdirSync(directory)
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry)
    const stats = statSync(absolutePath)

    if (stats.isDirectory()) {
      files.push(...walkFiles(absolutePath))
      continue
    }

    files.push(absolutePath)
  }

  return files
}

const componentFiles = walkFiles(componentsRoot)
  .filter((filePath) => filePath.endsWith('.tsx'))
  .filter((filePath) => !filePath.endsWith('.stories.tsx'))
  .filter((filePath) => !filePath.includes('__tests__'))
  .filter((filePath) => !filePath.includes(`${path.sep}hooks${path.sep}`))
  .filter((filePath) => !path.basename(filePath).startsWith('use-'))
  .filter((filePath) => path.basename(filePath) !== 'index.tsx')

const missingStories = []

for (const componentFile of componentFiles) {
  const storyFile = componentFile.replace(/\.tsx$/, '.stories.tsx')
  if (!existsSync(storyFile)) {
    missingStories.push(path.relative(repoRoot, storyFile))
  }
}

if (missingStories.length > 0) {
  console.error('Story coverage check failed. Missing story files:')
  for (const missingStory of missingStories) {
    console.error(`- ${missingStory}`)
  }
  process.exit(1)
}

const storyCount = componentFiles.length - missingStories.length

console.log(
  `Story coverage check passed (${storyCount} stories for ${componentFiles.length} components)`
)
