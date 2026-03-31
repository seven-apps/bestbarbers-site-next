import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade - BestBarbers",
  description:
    "Política de Privacidade da plataforma BestBarbers. Saiba como coletamos, usamos e protegemos suas informações.",
};

const sections = [
  { id: 1, title: "Informações coletadas" },
  { id: 2, title: "Uso das informações coletadas" },
  { id: 3, title: "A respeito de cookies" },
  { id: 4, title: "Links para outros sites" },
  { id: 5, title: "Crianças" },
  { id: 6, title: "Segurança" },
  { id: 7, title: "Como atualizar, corrigir ou excluir suas informações" },
  { id: 8, title: "Disposições gerais" },
  { id: 9, title: "Entre em contato" },
];

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#121212] py-6 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Link href="/">
            <Image
              src="/images/Logo-BestBarbers-branco_1.webp"
              alt="BestBarbers Logo"
              width={140}
              height={32}
              className="w-[120px] md:w-[140px] h-auto"
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#121212] mb-10">
          Política de privacidade:
        </h1>

        {/* Table of Contents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-12 text-sm">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#section-${s.id}`}
              className="text-[#121212] hover:text-[#ffaf02] transition-colors py-1"
            >
              {s.id}. {s.title}
            </a>
          ))}
        </div>

        {/* Intro */}
        <p className="text-gray-600 text-sm mb-10 leading-relaxed">
          Ao utilizar este website, você concorda com os termos da presente
          Política de Privacidade.
        </p>

        {/* Sections */}
        <div className="space-y-10 text-[#121212] text-sm leading-relaxed">
          {/* 1 */}
          <section id="section-1">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              1. Informações coletadas:
            </h2>
            <p>
              Nosso servidor coletará informações utilizadas apenas para cadastro
              dos usuários, tais como qualificação civil, imagem, endereço, meios
              de contato telefônico, dados de pagamento mediante cartão de crédito
              bancário, e-mail e mídias sociais. Coletamos essas informações apenas
              mediante prévia autorização dos usuários que concordaram com os Termos
              de Uso e Política de Privacidade. Ao fornecer informações através
              deste site, você consente com a coleta, uso e divulgação de
              informações, de acordo com esta Política de Privacidade.
            </p>
          </section>

          {/* 2 */}
          <section id="section-2">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              2. Uso das informações coletadas:
            </h2>
            <p>
              As informações que coletamos são usadas com o objetivo de melhorar o
              conteúdo do nosso website, notificar os usuários sobre as
              atualizações disponíveis e para compras, transações, ofertas,
              promoções e campanhas de publicidade de nossos serviços. Com objetivo
              de potencializar o uso dos nossos serviços, são colhidas também
              informações diversas, tais como dados geográficos, demográficos e de
              perfil de consumo, resguardada a intimidade dos usuários, sem qualquer
              exposição pública. O BestBarbers App não disponibiliza e-mails e
              demais informações pessoais de usuários cadastrados a outras
              organizações e/ou parceiros, salvo quando expressamente autorizado ou
              em circunstâncias previstas nesta Política. As pessoas que nos
              fornecerem seus números de telefone poderão ser contatados via
              telefone, com informações a respeito de novos produtos e serviços. Se
              você não deseja receber essas ligações, por favor nos avise.
            </p>
          </section>

          {/* 3 */}
          <section id="section-3">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              3. A respeito de cookies:
            </h2>
            <p>
              Os cookies são utilizados para armazenar as preferências do usuário
              em seu computador e oferecer um serviço personalizado. Servem para
              reconhecer, acompanhar seus hábitos de navegação e alertar os
              visitantes sobre novas áreas que podem ser de seu interesse cada vez
              que retornarem ao nosso site. O BestBarbers App usa cookies, tags e
              outras tecnologias similares para melhorar sua experiência em nosso
              website e fornecer-lhe informações adequadas às suas necessidades.
              Você poderá recusar os cookies. Por favor, consulte as instruções de
              seu navegador para saber mais sobre cookies e sobre como
              desabilitá-los.
            </p>
          </section>

          {/* 4 */}
          <section id="section-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              4. Links para outros sites:
            </h2>
            <p>
              Este website poderá conter links para outros sites externos, parceiros
              e/ou patrocinadores, que podem ter políticas de privacidade diferentes
              das nossas, estando assim sujeitas às suas próprias práticas de
              obtenção e uso de dados. Lembre-se que se você fornecer informações
              pessoais em outros sites, fóruns ou chats, tais informações poderão
              ser recolhidas e utilizadas indevidamente por terceiros. O BestBarbers
              App não se responsabiliza pelo conteúdo de tais sites nem pelo
              manuseio das informações por terceiros. Por isso, recomendamos que
              nossos usuários sempre leiam as normas de relacionamento e política de
              privacidade específicas dentro do próprio site do parceiro ou
              patrocinador que colete suas informações. A Política de Privacidade do
              BestBarbers App se aplica unicamente às informações coletadas para o
              seu uso, por meio do BestBarbers App ou website de endereço
              https://bestbarbers.app
            </p>
          </section>

          {/* 5 */}
          <section id="section-5">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              5. Crianças:
            </h2>
            <p>
              Este site não se destina a menores de 15 (quinze) anos de idade. O
              BestBarbers App não coleta ou solicita dados pessoalmente
              identificáveis de visitantes dessa faixa etária intencionalmente,
              exceto quando permitido pela respectiva legislação. Qualquer pessoa
              que nos preste suas informações pessoais através do BestBarbers App
              declara que tem 15 (quinze) anos de idade ou mais. Caso seu filho
              tenha enviado dados pessoais e você queira excluir tais dados dos
              nossos registros, poderá fazê-lo através de solicitação para o e-mail
              help@bestbarbers.app.
            </p>
          </section>

          {/* 6 */}
          <section id="section-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              6. Segurança:
            </h2>
            <p>
              O BestBarbers App utiliza medidas de segurança comercialmente razoáveis
              para proteger as informações contidas em nossos servidores e banco de
              dados. Contudo, sabe-se que nenhum sistema de segurança é 100% seguro.
              Deste modo, ainda que o BestBarbers App sempre faça o possível para
              proteger suas informações pessoais, não temos como garantir a absoluta
              segurança dos nossos servidores. É possível ainda que os dados
              fornecidos por você sejam interceptados por terceiros durante a
              transmissão. É uma decisão pessoal a utilização do serviço nessas
              condições. Quando recebemos e transferimos certos tipos de informação
              confidencial, como informações financeiras, dados de cartão de crédito
              e afins, redirecionamos os visitantes a servidores seguros
              notificando-os através de uma janela pop-up em nosso website. Sempre
              que solicitamos um número de cartão de crédito esse número será
              transmitido no formato criptografado padrão da indústria, SSL (Secure
              Sockets Layer, camada de soquetes de segurança). Sua senha é secreta,
              mantenha-a em segurança e procure não divulgá-la a ninguém. Caso você
              esqueça a sua senha, uma nova será fornecida, mediante solicitação
              prévia, e enviada para a sua conta de e-mail informada. Sugerimos que
              você escolha uma senha não óbvia, misturando letras e números.
              Lembre-se que você é responsável por manter o sigilo de suas senhas e
              qualquer informação da sua conta do BestBarbers App. Não solicitaremos,
              em nenhuma hipótese, seja por e-mail ou telefone, sua senha pessoal.
              Recomendamos que você se desconecte de sua conta do BestBarbers App e
              feche a janela do seu navegador quando concluir sua navegação na
              Internet. Este procedimento evita que terceiros tenham acesso aos seus
              dados pessoais, caso você compartilhe um computador com alguém ou
              esteja usando um computador em local público.
            </p>
          </section>

          {/* 7 */}
          <section id="section-7">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              7. Como atualizar, corrigir ou excluir suas informações:
            </h2>
            <p>
              Você é responsável por manter suas informações de registro completas e
              atualizadas. Para atualizar as suas informações de registro, acesse a
              sua conta do BestBarbers App e faça a alteração desejada para alterar
              as suas preferências de usuário.
            </p>
          </section>

          {/* 8 */}
          <section id="section-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              8. Disposições gerais:
            </h2>
            <p>
              Ao utilizar nosso website, você manifesta sua concordância com esta
              Política de Privacidade, que poderá ser alterada periodicamente. Se
              você não concordar com esta Política de Privacidade, não utilize o
              nosso website nem os serviços nele oferecidos. O BestBarbers App
              reserva-se o direito de alterar esta Política de Privacidade, o que
              será avisado aos nossos usuários por meios razoáveis, inclusive através
              de e-mail para o endereço informado e/ou publicando a notificação e a
              política alterada no site do BestBarbers App. A continuação do uso dos
              nossos serviços e do website após as alterações da Política de
              Privacidade significa que você aceita e concorda com as mudanças
              realizadas. As informações coletadas ou fornecidas depois da
              atualização da Política de Privacidade serão regidas por esta última.
            </p>
          </section>

          {/* 9 */}
          <section id="section-9">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              9. Entre em contato:
            </h2>
            <p>
              Seus comentários são bem-vindos. Caso você tenha dúvidas ou
              reclamações sobre a nossa Política de Privacidade, entre em contato
              pelo e-mail help@bestbarbers.app.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#121212] py-8 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            BestBarbers · 2020 © Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
