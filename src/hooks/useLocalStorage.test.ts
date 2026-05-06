import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// describe agrupa testes relacionados — melhora a leitura do relatório.
// O nome deve descrever o que está sendo testado, não como.
describe('useLocalStorage', () => {

  // Cada 'it' (ou 'test') é um cenário isolado.
  // A convenção "deve [comportamento]" deixa claro o que se espera.

  it('deve retornar o valor inicial quando o storage está vazio', () => {
    // renderHook renderiza um hook sem precisar de um componente real.
    // É a forma correta de testar hooks isoladamente.
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'valor inicial')
    )

    // result.current é o valor retornado pelo hook.
    // Desestruturamos o índice 0 (o valor) da tupla [valor, setter].
    expect(result.current[0]).toBe('valor inicial')
  })

  it('deve salvar e recuperar valores do storage', () => {
    const { result } = renderHook(() =>
      useLocalStorage<number>('test-key', 0)
    )

    // act() garante que as atualizações de estado sejam processadas
    // antes de verificar o resultado. Toda ação que causa mudança de estado
    // deve estar dentro de act().
    act(() => {
      result.current[1](42)  // chama o setter com o novo valor
    })

    expect(result.current[0]).toBe(42)
    // Verificamos também que foi salvo no localStorage de verdade
    expect(localStorage.getItem('test-key')).toBe('42')
  })

  it('deve recuperar valor existente do storage na inicialização', () => {
    // Simulamos um valor já existente no storage (de uma sessão anterior).
    localStorage.setItem('test-key', JSON.stringify('valor salvo'))

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'valor inicial')
    )

    // Deve usar o valor do storage, não o initialValue
    expect(result.current[0]).toBe('valor salvo')
  })

  it('deve suportar functional update', () => {
    const { result } = renderHook(() =>
      useLocalStorage<number[]>('test-key', [])
    )

    act(() => {
      // Functional update: recebe o valor anterior e retorna o novo
      result.current[1](prev => [...prev, 1])
    })
    act(() => {
      result.current[1](prev => [...prev, 2])
    })

    // Ambos os itens devem estar presentes — sem perda por closure desatualizado
    expect(result.current[0]).toEqual([1, 2])
  })

  it('deve retornar valor inicial se o storage contiver JSON inválido', () => {
    // Simula storage corrompido
    localStorage.setItem('test-key', 'isso não é json válido{{{')

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback')
    )

    // O hook deve se recuperar graciosamente — sem lançar erro
    expect(result.current[0]).toBe('fallback')
  })
})
