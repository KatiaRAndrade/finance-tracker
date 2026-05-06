import { render, screen, fireEvent } from '@testing-library/react'
import { TransactionList } from './TransactionList'
import type { Transaction } from './transaction.types'

const mockItems: Transaction[] = [
  {
    id: '1',
    description: 'Mercado Extra',
    amount: 187.40,
    category: 'food',
    type: 'expense',
    date: '2026-04-14',
  },
  {
    id: '2',
    description: 'Salário',
    amount: 4800,
    category: 'income',
    type: 'income',
    date: '2026-04-10',
  },
]

describe('TransactionList', () => {

  it('deve renderizar todas as transações', () => {
    render(<TransactionList items={mockItems} onDelete={vi.fn()} />)
    // vi.fn() cria um mock de função — sem implementação real.
    // Usamos porque TransactionList exige a prop, mas não queremos
    // testar o comportamento do delete aqui, só a renderização.

    // screen.getByText procura pelo texto no DOM renderizado.
    expect(screen.getByText('Mercado Extra')).toBeInTheDocument()
    expect(screen.getByText('Salário')).toBeInTheDocument()
  })

  it('deve renderizar estado vazio quando não há transações', () => {
    render(<TransactionList items={[]} onDelete={vi.fn()} />)

    expect(screen.getByText('Nenhuma transação ainda')).toBeInTheDocument()
  })

  it('deve chamar onDelete com o id correto ao clicar em deletar', () => {
    // vi.fn() com implementação vazia — só queremos saber se foi chamado
    const onDelete = vi.fn()

    render(<TransactionList items={mockItems} onDelete={onDelete} />)

    // aria-label que definimos no botão de delete
    const deleteButtons = screen.getAllByRole('button', { name: /deletar transação/i })

    // Clicamos no botão da primeira transação
    fireEvent.click(deleteButtons[0])

    // Verificamos que foi chamado com o id correto
    expect(onDelete).toHaveBeenCalledWith('1')
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('deve exibir valores positivos para receitas e negativos para despesas', () => {
    render(<TransactionList items={mockItems} onDelete={vi.fn()} />)

    // getAllByText evita erro de "múltiplos elementos" em estruturas aninhadas
    expect(screen.getAllByText(/\+/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/[−–]/).length).toBeGreaterThan(0)
  })

  it('deve exibir o badge de categoria correto', () => {
    render(<TransactionList items={mockItems} onDelete={vi.fn()} />)

    // Labels definidos em CATEGORIES. Regex porque o <p> renderiza
    // "{label} · {date}" — getByText com string exata não encontra.
    expect(screen.getByText(/^Alimentação/)).toBeInTheDocument()
    // income label no CATEGORIES é "Entradas"
    expect(screen.getByText(/^Entradas/)).toBeInTheDocument()
  })
})
