import { Vollkorn, Montserrat } from "next/font/google";

const vollkorn = Vollkorn({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-vollkorn",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function V12Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* GTM-WWR94GLQ REMOVIDO (02/Jul/2026): o container disparava uma 2ª tag Meta
          Pixel 'Lead' (pixel 1100195158903491) no trigger form_submit com eventId
          próprio (nunca casa com o leadEventId do código) → TODO submit da /v12
          contava 2 leads na Meta e dobrava o CPL-real de todos os anúncios.
          O container também carregava GA4 G-EPNE6CJL7C + conversão Google Ads
          (herança de agência; sem campanha Google ativa conhecida). O tracking
          oficial da LP segue no código (useLeadForm/useMetaPixel) + GTM global. */}
      <div className={`${vollkorn.variable} ${montserrat.variable}`}>
        {children}
      </div>
    </>
  );
}
