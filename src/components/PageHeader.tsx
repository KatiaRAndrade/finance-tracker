import type { ReactNode } from "react";

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
	return (
		<header className="flex items-start justify-between mb-10">
			<div>
				<h2 className="text-5xl mb-1 font-display italic font-medium">
					{title}
				</h2>
				{subtitle && (
					<p className="text-[11px] uppercase text-white/45 tracking-editorial">
						{subtitle}
					</p>
				)}
			</div>
			{action && <div>{action}</div>}
		</header>
	);
}

interface ActionButtonProps {
	label: string;
	onClick?: () => void;
}

export function ActionButton({ label, onClick }: ActionButtonProps) {
	return (
		<button
			onClick={onClick}
			className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-[0.14em] text-bg transition-opacity hover:opacity-85 cursor-pointer"
			style={{ background: "linear-gradient(90deg, #e8919c, #f0a989)", border: "none" }}
		>
			<span className="text-base font-light leading-none">+</span>
			{label}
		</button>
	);
}
