import { createContext, useContext, type ReactNode } from "react";
import { useTransactions } from "../features/transactions/useTransactions";

// Tipo derivado do retorno do hook — nunca fica desincronizado.
// Se useTransactions ganhar um campo novo, o tipo do contexto se atualiza.
type TransactionContextType = ReturnType<typeof useTransactions>;

// 'null' como valor inicial permite detectar uso fora do Provider.
const TransactionContext = createContext<TransactionContextType | null>(null);

// Provider: cria a "instância única" do estado de transações.
// Tudo dentro de <TransactionProvider> compartilha o mesmo estado.
export function TransactionProvider({ children }: { children: ReactNode }) {
	const value = useTransactions();

	return (
		<TransactionContext.Provider value={value}>
			{children}
		</TransactionContext.Provider>
	);
}

// Hook de consumo com proteção.
// Componentes usam essa função em vez de useContext direto —
// isso esconde o detalhe de implementação. Se trocar Context por
// Zustand/Redux amanhã, só esse arquivo muda.
// eslint-disable-next-line react-refresh/only-export-components
export function useTransactionContext() {
	const context = useContext(TransactionContext);

	if (!context) {
		throw new Error(
			"useTransactionContext deve ser usado dentro de <TransactionProvider>",
		);
	}

	return context;
}
