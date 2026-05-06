import type { ReactNode } from "react";
import { FilterContext } from "./FilterContext";
import {
	FilterPeriod,
	FilterCategory,
	FilterType,
	FilterReset,
} from "./FilterSubcomponents";
import type { FilterContextType } from "./filter.types";

// Props do componente raiz.
// 'value' é o objeto que vem do useFilters — o Filter não gerencia
// estado próprio, ele apenas distribui o que recebe.
interface FilterProps {
	children: ReactNode;
	value: FilterContextType; // vem de useFilters(), passado pelo container
}

// O componente raiz: só cria o Provider com o valor e renderiza os filhos.
// Toda a "mágica" do Compound Component é essa — os filhos acessam
// o contexto automaticamente, sem precisar receber props.
// eslint-disable-next-line react-refresh/only-export-components
function FilterRoot({ children, value }: FilterProps) {
	return (
		<FilterContext.Provider value={value}>
			<div className="flex flex-wrap items-center gap-3">{children}</div>
		</FilterContext.Provider>
	);
}

// Aqui montamos o objeto Filter com todos os subcomponentes como propriedades.
// Isso cria a API: <Filter.Period />, <Filter.Category />, etc.
//
// Por que não exportar cada um separado?
// Porque essa forma comunica que eles fazem parte de um sistema coeso.
// Filter.Period não faz sentido fora de Filter — o namespace deixa isso explícito.
// É a mesma ideia de React.StrictMode, React.Fragment, etc.
export const Filter = Object.assign(FilterRoot, {
	Period: FilterPeriod,
	Category: FilterCategory,
	Type: FilterType,
	Reset: FilterReset,
});
// Object.assign(target, source) copia as propriedades de source pra target.
// Aqui copiamos os subcomponentes pra função FilterRoot.
// O resultado é uma função (componente) que também tem propriedades.
