import type { ReactNode } from "react";

// Header de página — usado em Visão Geral, Transações e Metas.
// Centraliza o estilo serif itálico do título (a "marca" tipográfica
// do design fintrack) e o botão de ação no canto direito.

interface PageHeaderProps {
	title: string;
	subtitle?: string; // ex: "MAIO 2026" ou "12 REGISTROS"
	action?: ReactNode; // botão customizável (Registrar, Nova, Meta...)
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
	return (
		<header className="flex items-start justify-between mb-10">
			<div>
				{/* Título: serif itálica grande — a marca registrada do visual */}
				<h2
					className="text-5xl mb-1"
					style={{
						fontFamily: "'Playfair Display', serif",
						fontStyle: "italic",
						fontWeight: 500,
					}}
				>
					{title}
				</h2>
				{subtitle && (
					<p
						className="text-[11px] uppercase text-white/45"
						style={{ letterSpacing: "0.16em" }}
					>
						{subtitle}
					</p>
				)}
			</div>

			{action && <div>{action}</div>}
		</header>
	);
}

// Botão padrão usado nos headers das páginas.
// Estilo "outline" minimalista com texto uppercase em duas linhas.
interface ActionButtonProps {
	label: string; // ex: "Registrar", "Nova", "Meta"
	onClick?: () => void;
}

export function ActionButton({ label, onClick }: ActionButtonProps) {
	return (
		<button
			onClick={onClick}
			className="flex flex-col items-center px-6 py-3 rounded-xl text-white text-[11px] uppercase transition-all hover:bg-white/[0.02]"
			style={{
				border: "0.5px solid rgba(255,255,255,0.10)",
				letterSpacing: "0.16em",
			}}
		>
			<span className="text-base leading-none mb-0.5">+</span>
			{label}
		</button>
	);
}
