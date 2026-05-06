import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Fontes do design fintrack — instaladas via @fontsource pra não
// depender de requisições externas em produção.
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/500-italic.css";

// StrictMode renderiza componentes 2x em dev pra detectar
// efeitos colaterais inesperados. Em produção, sem impacto.
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
