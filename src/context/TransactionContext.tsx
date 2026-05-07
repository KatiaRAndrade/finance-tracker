import { createContext, useContext, type ReactNode } from "react";
import { useTransactions } from "../features/transactions/useTransactions";

type TransactionContextType = ReturnType<typeof useTransactions>;

const TransactionContext = createContext<TransactionContextType | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
	const value = useTransactions();

	return (
		<TransactionContext.Provider value={value}>
			{children}
		</TransactionContext.Provider>
	);
}

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
