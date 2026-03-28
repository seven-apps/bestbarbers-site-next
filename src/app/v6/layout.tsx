import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BestBarbers — De R$15.892 para R$31.690. Mesmas 4 cadeiras.",
  description:
    "353 assinantes pagando todo mes. Sem taxa de implantacao. 1.200+ barbearias ja usam. Diagnostico gratuito em minutos.",
  robots: { index: false, follow: false },
};

export default function V6Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* GTM — afterInteractive para nao bloquear render */}
      <Script
        id="gtm-v6"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5D39P7HS');`,
        }}
      />

      {/* Meta Pixel — afterInteractive */}
      <Script
        id="meta-pixel-v6"
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
