import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
