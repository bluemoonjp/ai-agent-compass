import assert from 'node:assert/strict'
import { test } from 'node:test'
import { reviewListIds } from './patrol-review-list.mjs'

function practiceFile(path, { id, appliesTo, status = 'active' }) {
  return {
    path,
    text: `---\nid: "${id}"\ntitle: Sample\nstatus: ${status}\ntopic: instruction-files\napplies_to:\n${appliesTo.map((t) => `  - ${t}`).join('\n')}\nrule: A sample rule.\nlicense: CC-BY-4.0\nsources: []\n---\n\n## Why\n\nSample.\n`,
  }
}

function antipatternFile(path, { id, classification, status = 'active' }) {
  return {
    path,
    text: `---\nid: "${id}"\ntitle: Sample\nstatus: ${status}\ntopic: instruction-files\napplies_to:\n  - general\nrule: A sample rule.\nlicense: CC-BY-4.0\nclassification: ${classification}\nrelates_to:\n  - "0001"\nsources: []\n---\n\n## Symptom\n\nSample.\n`,
  }
}

test('lists an active practice whose applies_to includes claude-code', () => {
  const files = [practiceFile('practices/0001-sample.md', { id: '0001', appliesTo: ['claude-code'] })]
  assert.deepEqual(reviewListIds({ files }), ['practices/0001'])
})

test('excludes a practice whose applies_to omits claude-code', () => {
  const files = [practiceFile('practices/0001-sample.md', { id: '0001', appliesTo: ['general'] })]
  assert.deepEqual(reviewListIds({ files }), [])
})

test('excludes a draft practice even with claude-code in applies_to', () => {
  const files = [practiceFile('practices/0001-sample.md', { id: '0001', appliesTo: ['claude-code'], status: 'draft' })]
  assert.deepEqual(reviewListIds({ files }), [])
})

test('lists an undetermined antipattern', () => {
  const files = [antipatternFile('antipatterns/0001-sample.md', { id: '0001', classification: 'undetermined' })]
  assert.deepEqual(reviewListIds({ files }), ['antipatterns/0001'])
})

test('excludes a harmful or obsolete antipattern', () => {
  const files = [
    antipatternFile('antipatterns/0001-sample.md', { id: '0001', classification: 'harmful' }),
    antipatternFile('antipatterns/0002-sample.md', { id: '0002', classification: 'obsolete' }),
  ]
  assert.deepEqual(reviewListIds({ files }), [])
})

test('ignores a generated file such as practices/index.md', () => {
  const files = [{ path: 'practices/index.md', text: '# Practice index\n' }]
  assert.deepEqual(reviewListIds({ files }), [])
})

test('sorts practices and antipatterns together by their kind-prefixed id', () => {
  const files = [
    practiceFile('practices/0002-sample.md', { id: '0002', appliesTo: ['claude-code'] }),
    antipatternFile('antipatterns/0001-sample.md', { id: '0001', classification: 'undetermined' }),
    practiceFile('practices/0001-sample.md', { id: '0001', appliesTo: ['claude-code'] }),
  ]
  assert.deepEqual(reviewListIds({ files }), ['antipatterns/0001', 'practices/0001', 'practices/0002'])
})
