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
    ];
  },
};

export default nextConfig;
