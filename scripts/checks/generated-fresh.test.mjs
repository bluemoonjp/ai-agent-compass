import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

import {
  INSTRUCTION_FILE_SKILL_DIR,
  parseAntipatternDetails,
  parsePracticeDetails,
  parsePracticeRows,
  renderPracticeIndex,
  renderReferenceFile,
  renderTemplateReferenceReadme,
  stripAdaptersNote,
} from '../gen.mjs'
import { run } from './generated-fresh.mjs'

const root = process.cwd()
const fixturesDir = path.join(root, 'scripts', 'checks', 'fixtures', 'generated-fresh')

function loadFixture(rel) {
  return readFileSync(path.join(fixturesDir, `${rel}.fixture`), 'utf8').replace(/\r\n/g, '\n')
}

test('positive fixture notice tells the maintainer to run pnpm gen', () => {
  const files = [
    { path: 'checks.json', text: loadFixture('checks.json') },
    { path: 'docs/maintain/authoring.md', text: loadFixture('docs/maintain/authoring.md') },
  ]
  const { findings, notices } = run({ files })
  assert.ok(findings.length > 0)
  assert.ok(notices.some((n) => n.includes('run: pnpm gen')))
})

test('negative fixture has no findings and no notice', () => {
  const files = [
    { path: 'checks.json', text: loadFixture('negative/checks.json') },
    { path: 'docs/maintain/authoring.md', text: loadFixture('negative/docs/maintain/authoring.md') },
  ]
  const result = run({ files })
  assert.equal(result.findings.length, 0)
  assert.equal(result.notices, undefined)
})

test('stale practices/index.md produces an index-stale finding', () => {
  const files = [{ path: 'practices/index.md', text: loadFixture('practices/index.md') }]
  const { findings, notices } = run({ files })
  assert.ok(findings.some((f) => f.ruleId === 'generated-fresh:index-stale'))
  assert.ok(notices.some((n) => n.includes('practices/index.md') && n.includes('run: pnpm gen')))
})

test('fresh practices/index.md (no practice files present) produces no finding', () => {
  const files = [{ path: 'practices/index.md', text: loadFixture('negative/practices/index.md') }]
  const result = run({ files })
  assert.equal(result.findings.length, 0)
})

test('stale README.md generated blocks produce a readme-stale finding', () => {
  const files = [{ path: 'README.md', text: loadFixture('README.md') }]
  const { findings, notices } = run({ files })
  assert.ok(findings.some((f) => f.ruleId === 'generated-fresh:readme-stale'))
  assert.ok(notices.some((n) => n.includes('README.md') && n.includes('run: pnpm gen')))
})

test('fresh README.md generated blocks (no practice files present) produce no finding', () => {
  const files = [{ path: 'README.md', text: loadFixture('negative/README.md') }]
  const result = run({ files })
  assert.equal(result.findings.length, 0)
})

test('parsePracticeRows excludes a draft practice from the index', () => {
  const files = [
    {
      path: 'practices/0001-active-one.md',
      text: [
        '---',
        'id: "0001"',
        'title: Active one',
        'status: active',
        'topic: instruction-files',
        'applies_to:',
        '  - general',
        'rule: An active rule.',
        'license: CC-BY-4.0',
        'sources:',
        '  - url: https://example.com/a',
        '    kind: primary',
        '    confidence: verified',
        '    verified_on: "2026-01-02"',
        '    summary: A summary.',
        '    quote: A quote.',
        '---',
        '',
        '## Why',
        '',
        'Because.',
        '',
      ].join('\n'),
    },
    {
      path: 'practices/0002-draft-one.md',
      text: [
        '---',
        'id: "0002"',
        'title: Draft one',
        'status: draft',
        'topic: instruction-files',
        'applies_to:',
        '  - general',
        'rule: A draft rule.',
        'license: CC-BY-4.0',
        'sources:',
        '  - url: https://example.com/b',
        '    kind: primary',
        '    confidence: verified',
        '    verified_on: "2026-01-01"',
        '    summary: A summary.',
        '    quote: A quote.',
        '---',
        '',
        '## Why',
        '',
        'Because.',
        '',
      ].join('\n'),
    },
  ]

  const rows = parsePracticeRows(files)
  assert.deepEqual(
    rows.map((r) => r.id),
    ['0001'],
  )

  const rendered = renderPracticeIndex(rows)
  assert.ok(rendered.includes('0001'))
  assert.ok(!rendered.includes('0002'))
  assert.ok(!rendered.includes('Draft one'))
})

const SAMPLE_PRACTICE = [
  '---',
  'id: "0001"',
  'title: Active one',
  'status: active',
  'topic: instruction-files',
  'applies_to:',
  '  - general',
  'rule: An active rule.',
  'license: CC-BY-4.0',
  'sources:',
  '  - url: https://example.com/a',
  '    kind: primary',
  '    confidence: verified',
  '    verified_on: "2026-01-02"',
  '    summary: A summary.',
  '    quote: A quote.',
  '---',
  '',
  '## Why',
  '',
  'Because.',
  '',
].join('\n')

const SAMPLE_ANTIPATTERN = [
  '---',
  'id: "0001"',
  'title: A bad pattern',
  'status: active',
  'topic: instruction-files',
  'applies_to:',
  '  - general',
  'rule: Do not do the bad thing.',
  'license: CC-BY-4.0',
  'classification: harmful',
  'relates_to:',
  '  - "0001"',
  'sources:',
  '  - url: https://example.com/c',
  '    kind: primary',
  '    confidence: verified',
  '    verified_on: "2026-01-03"',
  '    summary: A summary.',
  '    quote: A quote.',
  '---',
  '',
  '## Symptom',
  '',
  'It looks bad.',
  '',
].join('\n')

const SAMPLE_SKILL = [
  '---',
  'name: sample-skill',
  'description: A sample skill.',
  'metadata:',
  '  topics:',
  '    - instruction-files',
  '---',
  '',
  '# sample-skill',
].join('\n')

// No metadata.topics: isolates the references/templates/ copy check below
// from the references/<topic>.md check above, which SAMPLE_SKILL's declared
// topic would otherwise also trigger.
const SAMPLE_SKILL_NO_TOPICS = ['---', 'name: sample-skill', 'description: A sample skill.', '---', '', '# sample-skill'].join(
  '\n',
)

test('stale skill references/<topic>.md produces a reference-stale finding', () => {
  const files = [
    { path: 'practices/0001-active-one.md', text: SAMPLE_PRACTICE },
    { path: 'antipatterns/0001-bad-pattern.md', text: SAMPLE_ANTIPATTERN },
    { path: 'plugins/compass/skills/sample-skill/SKILL.md', text: SAMPLE_SKILL },
    { path: 'plugins/compass/skills/sample-skill/references/instruction-files.md', text: 'stale content\n' },
  ]
  const { findings, notices } = run({ files })
  assert.ok(findings.some((f) => f.ruleId === 'generated-fresh:reference-stale'))
  assert.ok(notices.some((n) => n.includes('references/instruction-files.md') && n.includes('run: pnpm gen')))
})

test('a missing references/<topic>.md (topic declared, file never generated) is flagged', () => {
  const files = [
    { path: 'practices/0001-active-one.md', text: SAMPLE_PRACTICE },
    { path: 'antipatterns/0001-bad-pattern.md', text: SAMPLE_ANTIPATTERN },
    { path: 'plugins/compass/skills/sample-skill/SKILL.md', text: SAMPLE_SKILL },
  ]
  const { findings, notices } = run({ files })
  assert.ok(findings.some((f) => f.ruleId === 'generated-fresh:reference-stale'))
  assert.ok(notices.some((n) => n.includes('references/instruction-files.md') && n.includes('run: pnpm gen')))
})

test('fresh skill references/<topic>.md produces no finding', () => {
  const practices = parsePracticeDetails([{ path: 'practices/0001-active-one.md', text: SAMPLE_PRACTICE }])
  const antipatterns = parseAntipatternDetails([
    { path: 'antipatterns/0001-bad-pattern.md', text: SAMPLE_ANTIPATTERN },
  ])
  const rendered = renderReferenceFile('instruction-files', practices, antipatterns)

  const files = [
    { path: 'practices/0001-active-one.md', text: SAMPLE_PRACTICE },
    { path: 'antipatterns/0001-bad-pattern.md', text: SAMPLE_ANTIPATTERN },
    { path: 'plugins/compass/skills/sample-skill/SKILL.md', text: SAMPLE_SKILL },
    { path: 'plugins/compass/skills/sample-skill/references/instruction-files.md', text: rendered },
  ]
  const result = run({ files })
  assert.equal(result.findings.length, 0)
})

test('renderReferenceFile only includes an antipattern whose relates_to names an included practice', () => {
  const practices = parsePracticeDetails([{ path: 'practices/0001-active-one.md', text: SAMPLE_PRACTICE }])
  const unrelatedAntipattern = SAMPLE_ANTIPATTERN.replace('  - "0001"', '  - "9999"')
  const antipatterns = parseAntipatternDetails([
    { path: 'antipatterns/0001-bad-pattern.md', text: unrelatedAntipattern },
  ])
  const rendered = renderReferenceFile('instruction-files', practices, antipatterns)
  assert.ok(!rendered.includes('## Antipatterns'))
})

test('a missing references/templates/*.template (source exists, copy never generated) is flagged', () => {
  const files = [
    { path: `${INSTRUCTION_FILE_SKILL_DIR}/SKILL.md`, text: SAMPLE_SKILL_NO_TOPICS },
    { path: 'templates/AGENTS.md.template', text: 'source template\n' },
  ]
  const { findings, notices } = run({ files })
  assert.ok(findings.some((f) => f.ruleId === 'generated-fresh:reference-template-stale'))
  assert.ok(notices.some((n) => n.includes('references/templates/AGENTS.md.template')))
})

test('a missing references/templates/README.md (skill exists, README never generated) is flagged', () => {
  const files = [{ path: `${INSTRUCTION_FILE_SKILL_DIR}/SKILL.md`, text: SAMPLE_SKILL_NO_TOPICS }]
  const { findings, notices } = run({ files })
  assert.ok(findings.some((f) => f.ruleId === 'generated-fresh:reference-template-stale'))
  assert.ok(notices.some((n) => n.includes('references/templates/README.md')))
})

test('stale references/templates/*.template produces a reference-template-stale finding', () => {
  const files = [
    { path: `${INSTRUCTION_FILE_SKILL_DIR}/SKILL.md`, text: SAMPLE_SKILL_NO_TOPICS },
    { path: 'templates/AGENTS.md.template', text: 'source template\n' },
    {
      path: `${INSTRUCTION_FILE_SKILL_DIR}/references/templates/AGENTS.md.template`,
      text: 'stale copy\n',
    },
  ]
  const { findings, notices } = run({ files })
  assert.ok(findings.some((f) => f.ruleId === 'generated-fresh:reference-template-stale'))
  assert.ok(notices.some((n) => n.includes('references/templates/AGENTS.md.template')))
})

test('fresh references/templates/*.template and README produce no finding', () => {
  const sourceTemplate = 'source template\n\nBefore copying, check this repository\'s [adapters/README.md](../adapters/README.md) for details.\n'
  const files = [
    { path: `${INSTRUCTION_FILE_SKILL_DIR}/SKILL.md`, text: SAMPLE_SKILL_NO_TOPICS },
    { path: 'templates/AGENTS.md.template', text: sourceTemplate },
    {
      path: `${INSTRUCTION_FILE_SKILL_DIR}/references/templates/AGENTS.md.template`,
      text: stripAdaptersNote(sourceTemplate),
    },
    {
      path: `${INSTRUCTION_FILE_SKILL_DIR}/references/templates/README.md`,
      text: renderTemplateReferenceReadme(),
    },
  ]
  const result = run({ files })
  assert.equal(result.findings.length, 0)
})
