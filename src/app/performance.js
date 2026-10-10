// Configuração central de desempenho.
// Cada cena e efeito lê daqui quantas partículas e quais efeitos usar,
// para o "modo leve" funcionar em computadores simples de escola.

export const performanceModes = {
  normal: {
    stars: 150, // estrelas do fundo
    glow: true, // brilhos (filtros SVG/CSS, mais pesados)
    trails: true, // rastros dos elétrons
    twinkle: true, // estrelas piscando
  },
  light: {
    stars: 45,
    glow: false,
    trails: false,
    twinkle: false,
  },
}

export function getPerformance(lightMode) {
  return lightMode ? performanceModes.light : performanceModes.normal
}
