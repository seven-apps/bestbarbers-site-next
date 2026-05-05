import type { Metadata } from "next";

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
  return <>{children}</>;
}
