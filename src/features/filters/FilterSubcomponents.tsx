import { CATEGORIES } from "../transactions/transaction.types";
import { useFilterContext } from "./FilterContext";

// ─── Filter.Period ────────────────────────────────────────────────────────────
// Responsabilidade: selecionar mês e ano.
// Acessa o contexto interno do Filter — não recebe nenhuma prop de fora.

export function FilterPeriod() {
	const { filters, setFilter } = useFilterContext();

	// Geramos os últimos 12 meses dinamicamente.
	// Assim o componente nunca fica desatualizado — sempre mostra
	// o mês atual e os 11 anteriores, independente de quando for usado.
	const months = Array.from({ length: 12 }, (_, i) => {
		// Array.from com length cria um array de 12 posições.
		// O segundo argumento é um map — recebe (valor, índice).
		// Como o valor é undefined (array vazio), usamos só o índice 'i'.
		const date = new Date();
		date.setMonth(date.getMonth() - i); // subtrai i meses da data atual

		return {
			label: new Intl.DateTimeFormat("pt-BR", {
				month: "long",
				year: "numeric",
			}).format(date),
			month: date.getMonth(),
			year: date.getFullYear(),
		};
	});

	const currentValue = filters.period
		? `${filters.period.month}-${filters.period.year}`
		: "";
	// Usamos 'month-year' como valor do select pra identificar unicamente
	// cada período — mês sozinho não basta (dois janeiros de anos diferentes).

	return (
		<select
			value={currentValue}
			onChange={(e) => {
				if (!e.target.value) {
					// Valor vazio = "Todos os meses" selecionado
					// undefined remove o filtro de período
					setFilter("period", undefined);
					return;
				}

				const [month, year] = e.target.value.split("-").map(Number);
				// split('-') → ['4', '2026']
				// .map(Number) → [4, 2026]  (converte strings pra números)
				setFilter("period", { month, year });
			}}
			className="text-sm bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white/70 focus:outline-none focus:border-white/30 transition-colors"
		>
			<option value="">Todos os meses</option>
			{months.map(({ label, month, year }) => (
				<option key={`${month}-${year}`} value={`${month}-${year}`}>
					{label}
				</option>
			))}
		</select>
	);
}

// ─── Filter.Category ──────────────────────────────────────────────────────────
// Responsabilidade: filtrar por categoria.

export function FilterCategory() {
	const { filters, setFilter } = useFilterContext();

	return (
		<select
			value={filters.category ?? ""}
			// ?? '' : se category for undefined (sem filtro), mostra opção vazia
			onChange={(e) => {
				const value = e.target.value;
				// Se selecionou a opção vazia, remove o filtro (undefined)
				// Se selecionou uma categoria, ativa o filtro
				// 'as Category' é um type assertion: dizemos pro TypeScript
				// que confiamos que o valor é uma Category válida.
				// Isso é seguro aqui porque as options vêm de Object.entries(CATEGORIES).
				setFilter(
					"category",
					value ? (value as keyof typeof CATEGORIES) : undefined,
				);
			}}
			className="text-sm bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-white/70 focus:outline-none focus:border-white/30 transition-colors"
		>
			<option value="">Todas as categorias</option>
			{Object.entries(CATEGORIES).map(([key, { label }]) => (
				// Object.entries transforma o objeto em array de [chave, valor]
				// ex: [['food', { label: 'Alimentação', color: '...' }], ...]
				<option key={key} value={key}>
					{label}
				</option>
			))}
		</select>
	);
}

// ─── Filter.Type ──────────────────────────────────────────────────────────────
// Responsabilidade: filtrar por receita ou despesa.

export function FilterType() {
	const { filters, setFilter } = useFilterContext();

	const options = [
		{ value: "", label: "Todos" },
		{ value: "income", label: "Receitas" },
		{ value: "expense", label: "Despesas" },
	];

	return (
		<div className="flex gap-1 p-1 bg-white/[0.05] rounded-xl border border-white/10">
			{options.map((option) => {
				const isActive = (filters.type ?? "") === option.value;

				return (
					<button
						key={option.value}
						onClick={() =>
							setFilter(
								"type",
								option.value
									? (option.value as "income" | "expense")
									: undefined,
							)
						}
						className={`
              px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${
								isActive
									? "bg-white/10 text-white"
									: "text-white/40 hover:text-white/70"
							}
            `}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}

// ─── Filter.Reset ─────────────────────────────────────────────────────────────
// Responsabilidade: limpar todos os filtros.
// Só renderiza se houver filtros ativos — sem isso, o botão seria confuso.

export function FilterReset() {
	const { reset, filters } = useFilterContext();

	// hasActiveFilters: verifica se há alguma chave em filters
	const hasActiveFilters = Object.keys(filters).length > 0;

	// Retornar null é a forma React de não renderizar nada.
	// O componente existe na árvore mas não produz DOM.
	if (!hasActiveFilters) return null;

	return (
		<button
			onClick={reset}
			className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors px-2"
		>
			<svg
				width="12"
				height="12"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path d="M18 6L6 18M6 6l12 12" />
			</svg>
			Limpar filtros
		</button>
	);
}
