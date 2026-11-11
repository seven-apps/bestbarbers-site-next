import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Foto do parceiro criado pelo time no dashboard (/p/<slug>, 11/Nov/26): servida pelo OS, com a versão no caminho.
    remotePatterns: [
      { protocol: "https", hostname: "bbai.bestbarbers.app", pathname: "/api/parceiros-publico/foto/**" },
      // Só no `next dev`: o OS local (porta 3000) ou o ambiente de teste da tela (3099).
      ...(process.env.NODE_ENV === "development"
        ? [{ protocol: "http" as const, hostname: "localhost", pathname: "/api/parceiros-publico/foto/**" }]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/funcionalidades", destination: "/sistema-para-barbearia", permanent: true },
      { source: "/precos", destination: "/sistema-para-barbearia", permanent: true },
      { source: "/assinaturas", destination: "/clube-de-assinaturas", permanent: true },
      { source: "/agendamento", destination: "/agendamento-online", permanent: true },
      { source: "/nota-fiscal", destination: "/nota-fiscal-barbearia", permanent: true },
      { source: "/totem", destination: "/totem-autoatendimento", permanent: true },
      { source: "/financeiro", destination: "/gestao-financeira-barbearia", permanent: true },
      { source: "/comissoes", destination: "/gestao-comissoes-barbeiro", permanent: true },
      { source: "/app-proprio", destination: "/app-proprio-barbearia", permanent: true },
      // Link da bio do Instagram (André, 15/Set/26): a bio nunca muda, o destino troca aqui.
      // `?source=instabio` → originMap (useUtmParams) → origem 120004089 "Instagram - Link da bio".
      // TEMPORÁRIO de propósito: 308 fica em cache no celular e travaria o destino para sempre.
      { source: "/bio", destination: "/?source=instabio", permanent: false },
      // Link curto do parceiro Welker (André, 31/Out/26): foto no herói (source) + origem 120004199 no Ploomes.
      // Temporário pelo mesmo motivo do /bio. Parênteses do odesc codificados (o destino é lido como padrão de rota).
      { source: "/welker", destination: "/parceiros?source=welker&origin=120004199&odesc=Welker%20Mantalof%20%28Welker%20Barbershop%29", permanent: false },
      // Link curto do parceiro Gustavo Caravelli (André, 11/Nov/26): foto no herói (source) + origem 120004237 no Ploomes.
      { source: "/caravelli", destination: "/parceiros?source=gustavo-caravelli&origin=120004237&odesc=Gustavo%20Caravelli%20%28Barbearia%20Premium%29", permanent: false },
    ];
  },
};

export default nextConfig;
