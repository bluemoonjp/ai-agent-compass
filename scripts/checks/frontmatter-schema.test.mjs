import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import Ajv2020 from 'ajv/dist/2020.js'

const root = process.cwd()
const schemasDir = path.join(root, 'schemas')

test('schemas/*.schema.json compile under ajv strict mode', () => {
  const defs = JSON.parse(readFileSync(path.join(schemasDir, 'defs.schema.json'), 'utf8'))
  const practice = JSON.parse(readFileSync(path.join(schemasDir, 'practice.schema.json'), 'utf8'))
  const antipattern = JSON.parse(readFileSync(path.join(schemasDir, 'antipattern.schema.json'), 'utf8'))

  const ajv = new Ajv2020({ strict: true, allErrors: true })
  ajv.addSchema(defs)
  assert.doesNotThrow(() => ajv.compile(practice))
  assert.doesNotThrow(() => ajv.compile(antipattern))
})
