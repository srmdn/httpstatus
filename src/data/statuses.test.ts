import { describe, it, expect } from 'vitest'
import { STATUS_CODES, CATEGORY_META } from './statuses'

const VALID_CATEGORIES = ['1xx', '2xx', '3xx', '4xx', '5xx'] as const

describe('STATUS_CODES data integrity', () => {
  it('has at least one status per category', () => {
    for (const cat of VALID_CATEGORIES) {
      const found = STATUS_CODES.filter(s => s.category === cat)
      expect(found.length, `No status codes for category ${cat}`).toBeGreaterThan(0)
    }
  })

  it('every status code has all required fields', () => {
    for (const status of STATUS_CODES) {
      expect(status.code, 'missing code').toBeTypeOf('number')
      expect(status.name, `missing name for ${status.code}`).toBeTruthy()
      expect(status.category, `missing category for ${status.code}`).toBeTruthy()
      expect(status.description, `missing description for ${status.code}`).toBeTruthy()
      expect(status.whenToUse, `missing whenToUse for ${status.code}`).toBeTruthy()
      expect(status.commonMistakes, `missing commonMistakes for ${status.code}`).toBeTruthy()
      expect(status.example, `missing example for ${status.code}`).toBeTruthy()
    }
  })

  it('every status has a valid category', () => {
    for (const status of STATUS_CODES) {
      expect(VALID_CATEGORIES).toContain(status.category)
    }
  })

  it('status code matches its category prefix', () => {
    for (const status of STATUS_CODES) {
      const prefix = Math.floor(status.code / 100) + 'xx'
      expect(status.category, `${status.code} has wrong category`).toBe(prefix)
    }
  })

  it('has no duplicate status codes', () => {
    const codes = STATUS_CODES.map(s => s.code)
    const unique = new Set(codes)
    expect(unique.size).toBe(codes.length)
  })

  it('includes commonly expected status codes', () => {
    const codes = STATUS_CODES.map(s => s.code)
    expect(codes).toContain(200)
    expect(codes).toContain(201)
    expect(codes).toContain(301)
    expect(codes).toContain(400)
    expect(codes).toContain(401)
    expect(codes).toContain(403)
    expect(codes).toContain(404)
    expect(codes).toContain(500)
  })
})

describe('CATEGORY_META', () => {
  it('has an entry for every category', () => {
    for (const cat of VALID_CATEGORIES) {
      expect(CATEGORY_META[cat], `missing meta for ${cat}`).toBeDefined()
    }
  })

  it('every category meta has required fields', () => {
    for (const cat of VALID_CATEGORIES) {
      const meta = CATEGORY_META[cat]
      expect(meta.label).toBeTruthy()
      expect(meta.color).toBeTruthy()
      expect(meta.bg).toBeTruthy()
      expect(meta.border).toBeTruthy()
    }
  })
})
