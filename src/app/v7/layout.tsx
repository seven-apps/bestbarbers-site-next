import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BestBarbers — 353 assinantes. 4 cadeiras. R$31.690/mês.",
  description:
    "Caso real de Embu das Artes/SP. A partir de R$299/mês. Sem taxa de implantação. 1.200+ barbearias já usam.",
  robots: { index: false, follow: false },
};

export default function V7Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="gtm-v7"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5D39P7HS');`,
        }}
      />

      <Script
        id="meta-pixel-v7"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','1100195158903491');
            fbq('track','PageView');`,
        }}
      />

      {children}
    </>
  );
}
