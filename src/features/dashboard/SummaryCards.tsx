// Cards de resumo no estilo fintrack:
// O card "Saldo Atual" é o herói com gradiente coral.
// Os outros dois usam tipografia serif e label uppercase.

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 0,
	}).format(value);

interface Summary {
	totalIncome: number;
	totalExpenses: number;
	balance: number;
	count: number;
}

interface SummaryCardsProps {
	summary: Summary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
	const { totalIncome, totalExpenses, balance } = summary;
	const isPositive = balance >= 0;

	return (
		<div className="grid grid-cols-3 gap-5">
			{/* Hero card — gradiente coral com glow circles decorativos */}
			<div
				className="relative overflow-hidden rounded-2xl p-6 text-white"
				style={{
					background: isPositive
						? "linear-gradient(135deg, #e8919c 0%, #f0a989 60%, #f5b896 100%)"
						: "linear-gradient(135deg, #d97a89 0%, #c46b7a 100%)",
				}}
			>
				{/* Glows decorativos — efeito visual sutil */}
				<div
					className="absolute pointer-events-none"
					style={{
						top: "-40%",
						right: "-10%",
						width: 300,
						height: 300,
						background:
							"radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)",
						borderRadius: "50%",
					}}
				/>
				<div
					className="absolute pointer-events-none"
					style={{
						bottom: "-50%",
						right: "15%",
						width: 200,
						height: 200,
						background:
							"radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)",
						borderRadius: "50%",
					}}
				/>

				<div className="relative z-10">
					<p
						className="text-[11px] uppercase mb-4"
						style={{ letterSpacing: "0.16em", color: "rgba(255,255,255,0.85)" }}
					>
						Saldo Atual
					</p>
					<p
						className="text-[38px] leading-tight"
						style={{ fontFamily: "'Playfair Display', serif" }}
					>
						{formatCurrency(balance)}
					</p>
					<p
						className="text-xs mt-2"
						style={{ color: "rgba(255,255,255,0.85)" }}
					>
						{isPositive ? "↑ Saldo positivo" : "↓ Saldo negativo"}
					</p>
				</div>
			</div>

			<Card
				label="Receitas"
				value={formatCurrency(totalIncome)}
				sub="este mês"
				subColor="text-emerald-300"
			/>
			<Card
				label="Despesas"
				value={formatCurrency(totalExpenses)}
				sub="este mês"
				subColor="text-[#f5a3a3]"
			/>
		</div>
	);
}

interface CardProps {
	label: string;
	value: string;
	sub: string;
	subColor: string;
}

function Card({ label, value, sub, subColor }: CardProps) {
	return (
		<div className="rounded-2xl p-6 bg-[#141414] border border-white/[0.06]">
			<p
				className="text-[11px] uppercase mb-4 text-white/45"
				style={{ letterSpacing: "0.16em" }}
			>
				{label}
			</p>
			<p
				className="text-[38px] leading-tight text-white"
				style={{ fontFamily: "'Playfair Display', serif" }}
			>
				{value}
			</p>
			<p className={`text-xs mt-2 ${subColor}`}>{sub}</p>
		</div>
	);
}
