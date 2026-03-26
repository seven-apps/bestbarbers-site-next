import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso - BestBarbers",
  description:
    "Termos de Uso da plataforma BestBarbers. Leia os termos e condições para uso do nosso serviço.",
};

const sections = [
  { id: 1, title: "BestBarbers" },
  { id: 2, title: "Âmbito e definição" },
  { id: 3, title: "Mudança de Termos de Uso" },
  { id: 4, title: "Registro e responsabilidade pela conta" },
  { id: 5, title: "Responsabilidade pelo conteúdo e proibição de uso ilegal" },
  { id: 6, title: "Objeto do contrato, serviços do BestBarbers" },
  { id: 7, title: "Direitos de uso e publicação de BestBarbers" },
  { id: 8, title: "Política de Uso Justo" },
  { id: 9, title: "Conclusão do contrato, duração do contrato, rescisão" },
  { id: 10, title: "Remuneração e pagamentos" },
  { id: 11, title: "Copyright" },
  { id: 12, title: "Garantia para defeitos materiais e legais" },
  { id: 13, title: "Responsabilidade e força maior" },
  { id: 14, title: "Privacidade, transferência de dados" },
  {
    id: 15,
    title: "Lei aplicável, local de jurisdição, cláusula de mediação, outros",
  },
];

export default function TermosDeUso() {
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
          Termos de uso:
        </h1>

        {/* Table of Contents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 mb-12 text-sm">
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
          Importante: O uso desse site e todas as disputas legais relacionadas
          estão sujeitas aos termos e condições seguintes. Esta versão traduzida
          dos Termos de uso abaixo é fornecida apenas por conveniência.
        </p>

        {/* Sections */}
        <div className="space-y-10 text-[#121212] text-sm leading-relaxed">
          {/* 1 */}
          <section id="section-1">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              1. BestBarbers:
            </h2>
            <p>
              BestBarbers, é um serviço online (&quot;plataforma&quot;) para
              agendamento de serviços de barbearia e pagamento destes serviços
              prestados por terceiros. Além disso, o BestBarbers, oferece
              recursos adicionais para gerenciar usuários, campanhas de marketing
              e um sistema de geolocalização em tempo real.
            </p>
          </section>

          {/* 2 */}
          <section id="section-2">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              2. Âmbito e definição:
            </h2>
            <p>
              Estes Termos de Uso regem o uso da Plataforma e dos Serviços por
              usuários devidamente registrados
              (&quot;Cliente&quot;/&quot;Usuário&quot;/&quot;Barbearia&quot;).
            </p>
          </section>

          {/* 3 */}
          <section id="section-3">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              3. Mudança de Termos de Uso:
            </h2>
            <p>
              O BestBarbers, tem o direito de ajustar estes termos de uso, se um
              requisito é dado por um maior desenvolvimento da plataforma, em
              caso de alterações legais e no caso de um ajuste da gama de
              produtos e ofertas. Os Termos de Uso alterados serão enviados aos
              usuários registrados por e-mail, no máximo uma semana antes de sua
              entrada em vigor. Além disso, o BestBarbers publica os Termos de
              Uso alterados no website do BestBarbers. Os Termos de Uso podem ser
              contestados dentro de duas semanas a partir da entrada em vigor.
            </p>
          </section>

          {/* 4 */}
          <section id="section-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              4. Registro e responsabilidade pela conta:
            </h2>
            <div className="space-y-3">
              <p>
                4.1 O uso da plataforma requer um registro com a criação de uma
                conta. Uma conta só pode ser configurada por capacidade jurídica
                ilimitada, pessoas físicas, parceiros e pessoas jurídicas. Um
                pedido de aceitação do pedido não existe. 4.2 Você pode utilizar
                a plataforma online e agendar serviços, usando propriamente,
                através de seus funcionários. O uso de &quot;bots&quot;,
                programas ou de outra forma automatizada não é permitido. 4.3
                Para usar a Plataforma de Reservas, cada cliente que opta pela
                assinatura pelo app, a taxa de cobrança do app será aplicada. O
                uso gratuito não é possível na versão completa. 4.4 Ao se
                registrar, você deve fornecer seu nome completo, que sua empresa
                está registrada e um endereço de e-mail válido. Você deve estar
                autorizado a usar este e-mail. Você deve garantir que esteja
                acessível através deste e-mail. 4.5 O BestBarbers tem o direito
                de excluir completamente as contas sem aviso prévio, caso o
                usuário não tenha fornecido seu endereço de e-mail corretamente e
                a verificação por meio da opção dupla não seja possível. 4.6 Você
                é obrigado a manter seus dados impecáveis especialmente os
                detalhes do contato atualizados e informar imediatamente o
                BestBarbers sobre quaisquer alterações. 4.7 Você é responsável
                por garantir que a conta criada por você disponibilizada a
                terceiros que o nome de usuário e a senha sejam protegidos contra
                o acesso de terceiros. 4.8 Para todos os atos, que feitam usando
                nome de usuário e a senha, você é responsável por seus próprios
                ações, isso não se aplica se você não é responsável por este
                indivíduo, em particular se você protegeu o nome de usuário e
                senha contra o acesso de terceiros. 4.9 Você é obrigado a
                informar imediatamente ao BestBarbers se houver um uso indevido
                de uma senha ou conta, ou você sabe que um terceiro ganhou
                conhecimento de uma senha ou conta. 4.10 O BestBarbers tem o
                direito de remover contas não utilizadas que não contenham
                serviços cobráveis após a notificação.
              </p>
            </div>
          </section>

          {/* 5 */}
          <section id="section-5">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              5. Responsabilidade pelo conteúdo e proibição de uso ilegal:
            </h2>
            <div className="space-y-3">
              <p>
                5.1 Cada usuário é responsável por não intervir nos direitos de
                terceiros de qualquer tipo, em particular, mas não exclusivamente
                nome, título do trabalho ou direitos de marca comercial ou outros
                direitos de propriedade industrial pelo nome da conta, vírus,
                BestBarbers, etc. 5.2 O controle dos BestBarbers é da exclusiva
                responsabilidade do respectivo usuário. Os revendedores não são
                responsáveis, não necessitando, pelo conteúdo de seus clientes.
                5.3 Qualquer uso da plataforma online para fins ilegais é
                proibida. A cada utilização, as leis válidas, em particular os
                direitos de autor, o direito de concorrência, o direito de
                proteção de dados, o direito penal, etc., devem ser
                considerados. Qualquer violação pode autorizar a titular a
                rescisão. Não é permitido para fornecer conteúdo ou utilizá-lo
                que são violentos, glorificando a violência, racista, xenófobo,
                pornográfico ou sexualmente explícito, obsceno, caluniosos,
                difamatório ou assim pode ser compreendido. 5.4 Você não pode
                publicar Conteúdo que não seja abertamente necessário ou
                destinado a ser usado para o referido fim do BestBarbers. 5.5 É
                expressamente proibido o upload de vírus, worms ou outros códigos
                nocivos para a plataforma ou enviá-los por e-mail.
              </p>
            </div>
          </section>

          {/* 6 */}
          <section id="section-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              6. Objeto do contrato, serviços do BestBarbers:
            </h2>
            <p>
              6.1 Ao configurar uma conta, você adquire o direito de usar todas
              as funcionalidades disponíveis do BestBarbers, autorizado também o
              uso de todas as informações necessárias quando do cadastro, ou
              criação da conta. 6.2 A utilização dos dados é autorizada para os
              fins necessários ao BestBarbers, válidos para a prestação de
              serviços. 6.3 O BestBarbers pode excluir contas que estejam
              inativas, sendo necessária sua reativação pelo usuário. 6.4 As
              informações prestadas pelas
              &quot;usuários&quot;/&quot;clientes&quot;/&quot;barbearias&quot;,
              são de sua inteira responsabilidade, isentando totalmente o
              BestBarbers.
            </p>
          </section>

          {/* 7 */}
          <section id="section-7">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              7. Direitos de uso e publicação de BestBarbers:
            </h2>
            <p>
              7.1 Ao se cadastrar na plataforma os
              &quot;usuários&quot;/&quot;clientes&quot;/&quot;Barbearias&quot;,
              autorizam expressamente o uso das informações coletadas no
              cadastro, inclusive informações de terceiros prestadas pelas
              &quot;barbearias&quot;, sem que implique em qualquer
              responsabilização ao BestBarbers, pelas informações repassadas.
            </p>
          </section>

          {/* 8 */}
          <section id="section-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              8. Política de Uso Justo:
            </h2>
            <p>
              8.1 O uso da Plataforma e dos BestBarbers geralmente está sujeito a
              uma Política de Uso Justo, cabendo aos
              &quot;usuários&quot;/&quot;clientes&quot;/&quot;barbearias&quot;,
              respeitar as regras aqui previstas, bem como observar o que prevê a
              Política de Privacidade.
            </p>
          </section>

          {/* 9 */}
          <section id="section-9">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              9. Conclusão do contrato, duração do contrato, rescisão:
            </h2>
            <p>
              9.1 Com o cadastro na plataforma, ficará ativa a conta a ser
              utilizada, por tempo indeterminado, ressalvada a possibilidade de
              cancelamento da conta pelo BestBarbers em função de inatividade da
              conta. 9.2 Os
              &quot;usuários&quot;/&quot;Clientes&quot;/&quot;Barbearias&quot;,
              podem cancelar suas contas, por sua inteira responsabilidade, sem
              quaisquer ônus devidos.
            </p>
          </section>

          {/* 10 */}
          <section id="section-10">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              10. Remuneração e pagamentos:
            </h2>
            <p>
              10.1 Os &quot;usuários&quot;/&quot;clientes&quot;, fornecerão os
              dados para cobrança e pagamento dos serviços prestados pela
              barbearia, não existindo qualquer responsabilidade do BestBarbers.
              10.2 As &quot;barbearias&quot; receberão a remuneração pelos
              serviços pagos através da plataforma, estando cientes da cobrança
              de 8.5% em relação ao valor do serviço.
            </p>
          </section>

          {/* 11 */}
          <section id="section-11">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              11. Copyright:
            </h2>
            <p>
              11.1 A plataforma, a interface do usuário, bem como os componentes
              dos BestBarbers e outros serviços e ofertas, são protegidos por
              direitos autorais. Os direitos autorais incluem o código do
              programa, a documentação, a aparência, a estrutura e a organização
              do programa, todos os nomes dos programas e todas as logotipos.
              11.2 Todos os direitos sobre o software e a documentação associada,
              em particular o exercício de todos os direitos de propriedade, são
              reservados exclusivamente ao BestBarbers. Você receberá apenas os
              direitos de uso regidos por este Contrato.
            </p>
          </section>

          {/* 12 */}
          <section id="section-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              12. Garantia para defeitos materiais e legais:
            </h2>
            <p>
              12.1 O BestBarbers garante a condição acordada de ofertas e
              serviços encomendados, bem como certificando-se de que você usar
              este nos termos do contrato sem infringir direitos de terceiros.
            </p>
          </section>

          {/* 13 */}
          <section id="section-13">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              13. Responsabilidade e força maior:
            </h2>
            <p>
              13.1 O BestBarbers não é responsável pelas informações prestadas
              por aqueles que utilizem de BestBarbers, sendo apenas plataforma
              para armazenamento destes dados. 13.2 O usuário é inteiramente
              responsável pelas informações prestadas, concordando com os
              presentes termos quando da ativação e sua conta.
            </p>
          </section>

          {/* 14 */}
          <section id="section-14">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              14. Privacidade, transferência de dados:
            </h2>
            <p>
              14.1 O BestBarbers usará seus dados somente dentro do escopo desta
              relação contratual e, em particular, observará os regulamentos de
              proteção de dados. O BestBarbers, obrigou seus funcionários e
              subcontratados a cumprir e a proteger os dados. 14.2 A execução do
              contrato, em particular a transmissão de conteúdos, processamento
              de dados e serviço, pode ser realizada sem criptografia para
              e-mail. 14.3 O BestBarbers, tem direito a utilizar subcontratados
              para a execução do contrato e transferir o conteúdo enviado por
              você e todos os dados pessoais recebidos no âmbito deste acordo a
              estes subcontratados e tornar eles acessíveis. 14.4 O BestBarbers,
              tem, em especial, o direito de passar os dados pessoais para
              processamento de pagamento e também para uma verificação de crédito
              para os prestadores de serviços correspondentes.
            </p>
          </section>

          {/* 15 */}
          <section id="section-15">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              15. Lei aplicável, local de jurisdição, cláusula de mediação,
              outros:
            </h2>
            <p>
              15.1 Para todas as relações jurídicas das partes contratantes,
              aplica-se a legislação brasileira. 15.2 Local de execução e local
              exclusivo de jurisdição para todas as disputas decorrentes de ou
              relacionadas a este contrato é a sede da BestBarbers. 15.3 Todas as
              disputas da cobrança de remunerações do pago da plataforma on-line
              de acordo com o parágrafo 1, as partes tentam primeiro no contexto
              de uma mediação de um mediador extrajudicial para simples. Somente
              se a mediação não chegar ao fim ou terminar sem que a disputa seja
              totalmente resolvida, as partes terão acesso aos tribunais. As
              partes não estão impedidas de apresentar pedidos de medidas
              provisórias ou outros procedimentos urgentes. Em todos os outros
              casos, uma parte deve permitir que a outra parte meio antes de
              iniciar uma disputa legal. Se as partes não podem concordar com um
              mediador, concordando a utilização de Tribunal Arbitral. 15.4 Caso
              uma ou mais das disposições destes Termos e Condições seja ou se
              torne inválida, a validade das restantes disposições permanece
              inalterada. A disposição ineficaz é substituída pelas disposições
              estatutárias, a menos que as partes cheguem a um acordo que alcance
              o objetivo pretendido pela disposição inválida.
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
