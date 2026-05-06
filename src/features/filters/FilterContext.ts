import { createContext, useContext } from "react";
import type { FilterContextType } from "./filter.types";

// Esse contexto é INTERNO ao Compound Component.
// Diferente do TransactionContext (que é global e exportado),
// esse não deve ser exportado — só os subcomponentes do Filter
// têm acesso a ele. É um detalhe de implementação privado.
export const FilterContext = createContext<FilterContextType | null>(null);

// Hook de consumo com proteção.
// 'useFilterContext' (sem export) reforça que é interno —
// mas aqui exportamos porque os subcomponentes estão em arquivos separados.
// A regra é: só arquivos dentro de 'features/filters/' deveriam usar isso.
export function useFilterContext() {
	const context = useContext(FilterContext);

	if (!context) {
		throw new Error(
			"Subcomponentes de Filter devem ser usados dentro de <Filter>",
		);
	}

	return context;
}
