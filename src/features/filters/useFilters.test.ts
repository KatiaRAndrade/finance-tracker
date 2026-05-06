import { renderHook, act } from '@testing-library/react'
import { useFilters } from './useFilters'
import type { Transaction } from '../transactions/transaction.types'

// Conjunto de transações mock representando cenários reais.
// Cobrem categorias, tipos e datas diferentes pra testar cada filtro.
const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Mercado',
    amount: 200,
    category: 'food',
    type: 'expense',
    date: '2026-04-10',
  },
  {
    id: '2',
    description: 'Salário',
    amount: 5000,
    category: 'income',
    type: 'income',
    date: '2026-04-05',
  },
  {
    id: '3',
    description: 'Uber',
    amount: 35,
    category: 'transport',
    type: 'expense',
    date: '2026-03-20',  // mês diferente — importante pra testar filtro de período
  },
  {
    id: '4',
    description: 'Netflix',
    amount: 45,
    category: 'entertainment',
    type: 'expense',
    date: '2026-04-08',
  },
]

describe('useFilters', () => {

  it('deve retornar todas as transações quando não há filtros ativos', () => {
    const { result } = renderHook(() => useFilters(mockTransactions))

    // Sem nenhum filtro, filtered = todas as transações
    expect(result.current.filtered).toHaveLength(4)
    expect(result.current.hasActiveFilters).toBe(false)
  })

  describe('filtro por tipo', () => {
    it('deve filtrar apenas receitas', () => {
      const { result } = renderHook(() => useFilters(mockTransactions))

      act(() => { result.current.setFilter('type', 'income') })

      expect(result.current.filtered).toHaveLength(1)
      expect(result.current.filtered[0].description).toBe('Salário')
    })

    it('deve filtrar apenas despesas', () => {
      const { result } = renderHook(() => useFilters(mockTransactions))

      act(() => { result.current.setFilter('type', 'expense') })

      // 3 despesas no mock (Mercado, Uber, Netflix)
      expect(result.current.filtered).toHaveLength(3)
      result.current.filtered.forEach(t => {
        expect(t.type).toBe('expense')
      })
    })
  })

  describe('filtro por categoria', () => {
    it('deve filtrar por categoria específica', () => {
      const { result } = renderHook(() => useFilters(mockTransactions))

      act(() => { result.current.setFilter('category', 'food') })

      expect(result.current.filtered).toHaveLength(1)
      expect(result.current.filtered[0].category).toBe('food')
    })
  })

  describe('filtro por período', () => {
    it('deve filtrar transações do mês e ano corretos', () => {
      const { result } = renderHook(() => useFilters(mockTransactions))

      act(() => {
        // Abril = mês 3 no Date JS (0-indexed)
        result.current.setFilter('period', { month: 3, year: 2026 })
      })

      // Mercado (10/abr), Salário (05/abr) e Netflix (08/abr) = 3
      // Uber (20/mar) não deve aparecer
      expect(result.current.filtered).toHaveLength(3)
      result.current.filtered.forEach(t => {
        expect(t.date).toContain('2026-04')
      })
    })
  })

  describe('filtros combinados', () => {
    it('deve aplicar múltiplos filtros simultaneamente', () => {
      const { result } = renderHook(() => useFilters(mockTransactions))

      act(() => {
        result.current.setFilter('type', 'expense')
        result.current.setFilter('period', { month: 3, year: 2026 })
      })

      // Despesas em abril: Mercado e Netflix
      // Uber é março — não passa no filtro de período
      expect(result.current.filtered).toHaveLength(2)
    })
  })

  describe('reset', () => {
    it('deve limpar todos os filtros e retornar todas as transações', () => {
      const { result } = renderHook(() => useFilters(mockTransactions))

      act(() => {
        result.current.setFilter('type', 'expense')
        result.current.setFilter('category', 'food')
      })

      // Com filtros ativos
      expect(result.current.hasActiveFilters).toBe(true)

      act(() => { result.current.reset() })

      // Após reset: tudo volta
      expect(result.current.filtered).toHaveLength(4)
      expect(result.current.hasActiveFilters).toBe(false)
    })
  })
})
