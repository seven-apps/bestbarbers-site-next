'use client';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowDown, Check, CreditCard, MessageCircle, ShieldCheck, ChevronRight, RotateCcw, CircleAlert, Menu, X } from 'lucide-react';
import styles from './preview.module.css';

const steps = [
  { label: 'O cliente autoriza', title: 'A assinatura começa com o aceite do cliente.', text: 'Ele autoriza a cobrança no cartão. Essa autorização é parte do processo — não basta você cadastrar o nome dele.', icon: ShieldCheck },
  { label: 'A cobrança é recorrente', title: 'A mensalidade segue a cobrança no cartão.', text: 'Com a assinatura autorizada, a cobrança segue a configuração do plano. Você deixa de depender do comprovante como caminho para conferir esse pagamento.', icon: CreditCard },
  { label: 'Você acompanha', title: 'Veja a situação. Saiba o que precisa de atenção.', text: 'Acompanhe os pagamentos no sistema. Uma cobrança pendente precisa ser verificada; recorrência não é garantia de recebimento.', icon: Check },
];
export default function CobrancaPreview() {
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [menu, setMenu] = useState(false);
  const [name, setName] = useState('');
  const [heroMode, setHeroMode] = useState<'manual' | 'recorrente'>('recorrente');
  const [heroPaused, setHeroPaused] = useState(false);
  const [replay, setReplay] = useState(0);
  const root = useRef<HTMLElement>(null);
  const demo = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations: Animation[] = [];
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seen.has(entry.target)) continue;
        seen.add(entry.target);
        if (!preference.matches) animations.push(entry.target.animate([
          { opacity: 0.45, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' }));
      }
    }, { threshold: 0.15 });
    element.querySelectorAll('[data-reveal]').forEach(item => observer.observe(item));
    const stop = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
    preference.addEventListener('change', stop);
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const available = document.documentElement.scrollHeight - innerHeight;
        element.style.setProperty('--read-progress', String(available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 0));
      });
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update); update();
    return () => { observer.disconnect(); animations.forEach(a => a.cancel()); preference.removeEventListener('change', stop); removeEventListener('scroll', update); removeEventListener('resize', update); cancelAnimationFrame(frame); };
  }, []);
  function selectStep(index: number) {
    setStep(index); setPending(false);
    if (window.matchMedia('(max-width: 730px)').matches) demo.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  const current = steps[step];
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  return <main ref={root} className={styles.page}>
    <div className={styles.readProgress} aria-hidden="true"/>
    <div className={styles.preview}>PRÉVIA LOCAL <span>•</span> Experiência conceitual · nenhum dado é enviado</div>
    <header className={styles.nav}>
      <a href="#inicio" aria-label="BestBarbers — início"><Image src="/images/Logo-BestBarbers-branco_1.webp" alt="BestBarbers" width={156} height={36} priority /></a>
      <nav aria-label="Navegação da página" className={menu ? styles.menuOpen : ''}>
        <a href="#como-funciona" onClick={()=>setMenu(false)}>Como funciona</a><a href="#duvidas" onClick={()=>setMenu(false)}>Suas dúvidas</a>
        <a className={styles.navCta} href="#avaliar" onClick={()=>setMenu(false)}>Avaliar meu clube <ArrowRight size={16}/></a>
      </nav>
      <button className={styles.menuButton} aria-label={menu?'Fechar menu':'Abrir menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </header>
    <section id="inicio" className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span/> PARA QUEM JÁ TEM UM CLUBE DE ASSINATURAS</p>
        <p className={styles.problem}>Seu clube ainda depende de<br/><strong>“manda o comprovante”?</strong></p>
        <h1>Cobre a mensalidade<br/>no cartão com a<br/><em>BestBarbers.</em></h1>
        <p className={styles.support}>O cliente autoriza a assinatura. A cobrança é recorrente e você acompanha os pagamentos pelo sistema.</p>
        <a className={styles.primary} href="#como-funciona">Ver como funciona <ArrowDown size={19}/></a>
        <a className={styles.textLink} href="#avaliar">Já quero avaliar para minha barbearia <ArrowRight size={15}/></a>
      </div>
      <div key={replay} className={styles.heroVisual} data-paused={heroPaused} data-mode={heroMode} aria-label="Representação conceitual da mudança de rotina">
        <div className={styles.sceneToolbar}><span>UMA OUTRA ROTINA PARA O SEU CLUBE</span><div role="group" aria-label="Comparar formas de cobrança"><button aria-pressed={heroMode==='manual'} onClick={()=>setHeroMode('manual')}>Manual</button><button aria-pressed={heroMode==='recorrente'} onClick={()=>setHeroMode('recorrente')}>Com recorrência</button></div></div>
        <div className={styles.productScene}>
          <div className={styles.sceneHalo}/>
          <div className={styles.messageStack} aria-hidden={heroMode!=='manual'}><div><span>CONVERSA COM ASSINANTE</span><p>“Você consegue mandar<br/>o comprovante?”</p></div><div><span>OUTRA CONVERSA</span><p>“Paguei ontem.<br/>Já te envio.”</p></div><div><CircleAlert size={16}/><b>Ainda falta conferir.</b></div></div>
          <div className={styles.productWindow}>
            <div className={styles.windowChrome}><span/><span/><span/><small>CLUBE · ACOMPANHAMENTO</small><ShieldCheck size={14}/></div>
            <div className={styles.windowBrand}><Image src="/images/Logo-BestBarbers-branco_1.webp" alt="BestBarbers" width={114} height={26}/><span>VISÃO CONCEITUAL</span></div>
            <div className={styles.windowContent}><p className={styles.windowEyebrow}>VOCÊ NO CONTROLE DA CONFERÊNCIA</p><h3>O que foi pago.<br/>O que precisa de atenção.</h3><div className={styles.billingHeader}><span>ASSINATURA</span><span>SITUAÇÃO</span></div>
              <div className={styles.billingRow}><span className={styles.personAvatar}>A</span><div><b>Assinante de exemplo</b><small>Plano do clube · cartão</small></div><span className={styles.billPaid}><Check size={12}/> Confirmado</span></div>
              <div className={styles.billingRow}><span className={styles.personAvatar}>B</span><div><b>Assinante de exemplo</b><small>Plano do clube · cartão</small></div><span className={styles.billPending}><CircleAlert size={12}/> Verificar</span></div>
              <p className={styles.windowNote}>A recorrência faz parte da cobrança.<br/>A conferência continua importante.</p>
            </div>
          </div>
          <div className={styles.signatureCard}><div className={styles.cardChip}><CreditCard size={25}/><span>CLUBE DE ASSINATURAS</span></div><h3>Começa com<br/>a autorização<br/>do cliente.</h3><div><ShieldCheck size={16}/><span>Assinatura no cartão</span></div></div>
          <div className={styles.flowRibbon}><span><ShieldCheck size={16}/> Autoriza</span><span className={styles.ribbonLine}/><span><RotateCcw size={16}/> Cobrança</span><span className={styles.ribbonLine}/><span><Check size={16}/> Acompanha</span></div>
        </div>
        <div className={styles.sceneCaption} aria-live="polite"><b>{heroMode==='manual'?'Entre mensagens, o pagamento ainda precisa ser conferido.':'O cliente autoriza. Você acompanha a situação no sistema.'}</b><span>Explore a mudança nos botões acima.</span></div>
        <div className={styles.motionControls}><button onClick={()=>setHeroPaused(!heroPaused)} aria-pressed={heroPaused}>{heroPaused?'Continuar animação':'Pausar animação'}</button><button onClick={()=>{setReplay(replay+1);setHeroPaused(false);setHeroMode('recorrente')}}><RotateCcw size={12}/> Repetir sequência</button></div><p className={styles.caption}>Representação conceitual do processo, não uma captura do produto.</p>
      </div>
    </section>
    <div className={styles.bridge}><span>O clube já existe.</span><strong>A cobrança não precisa depender de procurar mensagem.</strong><a href="#como-funciona" aria-label="Explorar a cobrança"><ArrowDown/></a></div>
    <section id="como-funciona" className={styles.demoSection}>
      <div data-reveal className={styles.sectionIntro}><p className={styles.eyebrow}>ENTENDA O CAMINHO DO PAGAMENTO</p><h2>Do aceite do cliente<br/>à sua conferência.</h2><p>Escolha uma etapa e veja o que acontece. Sem precisar deixar seu contato para entender.</p></div>
      <div className={styles.demoGrid}>
        <div className={styles.stepList} aria-label="Etapas da demonstração">
          {steps.map((item,index)=>{const Icon=item.icon;return <button key={item.label} aria-pressed={step===index} onClick={()=>selectStep(index)} className={step===index?styles.activeStep:''}><span className={styles.stepIcon}><Icon size={23}/></span><span><b>{item.label}</b><small>{index===0?'Um aceite consciente.':index===1?'O plano orienta a cobrança.':'Pagamento e pendência à vista.'}</small></span><ChevronRight size={19}/></button>})}
          <div className={styles.stepExplanation} aria-live="polite"><h3>{current.title}</h3><p>{current.text}</p></div>
        </div>
        <div ref={demo} className={styles.demoStage}>
          <div className={styles.stageLabel}><span>EXPERIMENTE O FLUXO</span><span>Exemplo conceitual</span></div>
          <div className={styles.flowTrack} aria-label="Caminho da demonstração"><div className={styles.flowRail} aria-hidden="true"><span style={{transform:`scaleX(${step/2})`}}/></div>{steps.map((item,index)=><button key={item.label} onClick={()=>selectStep(index)} aria-label={`Mostrar etapa: ${item.label}`} aria-current={step===index?'step':undefined} data-reached={index<=step}><item.icon size={16}/><small>{['Autoriza','Cobra','Acompanha'][index]}</small></button>)}</div>
          <div className={styles.demoScene} key={`${step}-${pending}`}>
            {step===0?<div className={styles.phone}><div className={styles.phoneNotch}/><small>BARBEARIA EXEMPLO</small><h3>Seu plano.<br/>Sua autorização.</h3><div className={styles.planIcon}><CreditCard size={38}/></div><b>Assinatura do clube</b><p>Confira as condições e autorize a cobrança recorrente no cartão.</p><div className={styles.accept}><Check size={18}/> Aceite do cliente</div><button onClick={()=>setStep(1)}>Ver a próxima etapa <ArrowRight size={16}/></button><span className={styles.phoneNote}>Demonstração • não realiza pagamento</span></div>:step===1?<div className={styles.recurring}><div className={styles.orbit}><RotateCcw size={74} strokeWidth={1.2}/><CreditCard size={30}/></div><span className={styles.darkPill}>ASSINATURA AUTORIZADA</span><h3>A cobrança acompanha<br/>o plano contratado.</h3><p>O cartão é o meio de cobrança.<br/>Você acompanha a situação no sistema.</p><button onClick={()=>setStep(2)}>E como eu confiro? <ArrowRight size={16}/></button></div>:<div className={styles.payment}><div className={styles.paymentHeader}><b>Acompanhamento do clube</b><small>Exemplo sem dados reais</small></div><div className={styles.paymentClient}><span>BE</span><div><b>Assinante de exemplo</b><small>Mensalidade do clube</small></div></div><div className={pending?styles.pendingCard:styles.paidCard}>{pending?<CircleAlert size={30}/>:<ShieldCheck size={30}/>}<h3>{pending?'Precisa de atenção':'Pagamento confirmado'}</h3><p>{pending?'Verifique a situação e o próximo passo aplicável. Não considere a mensalidade recebida.':'A confirmação permite conferir a situação desse pagamento.'}</p></div><button aria-pressed={pending} onClick={()=>setPending(!pending)}>{pending?'Voltar ao pagamento confirmado':'E se o pagamento ficar pendente?'} <ArrowRight size={16}/></button></div>}
          </div>
          <p className={styles.stageFooter}><ShieldCheck size={16}/> Recorrência não elimina a possibilidade de pendências.</p>
        </div>
      </div>
    </section>
    <section data-reveal className={styles.application}><div><p className={styles.eyebrow}>PARA O CLUBE QUE VOCÊ JÁ TEM</p><h2>Antes de mudar a cobrança,<br/>vamos entender sua operação.</h2><p>O ponto de partida é como você trabalha hoje. Planos, vencimentos e assinantes precisam entrar nessa conversa.</p><a className={styles.primary} href="#avaliar">Quero avaliar meu clube <ArrowRight size={18}/></a></div><div className={styles.checklist}>{[['Como você cobra hoje?','Pix, dinheiro, cartão ou outro sistema: o caminho precisa fazer sentido para sua rotina.'],['Quais planos já estão vendidos?','Condições e vencimentos precisam ser considerados antes de orientar a mudança.'],['O que seus clientes precisam fazer?','A autorização da assinatura deve estar clara. Não presumimos que cartões migram automaticamente.']].map(([title,text])=><div key={title}><Check size={20}/><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>
    <section data-reveal id="duvidas" className={styles.faq}><div><p className={styles.eyebrow}>SEM DEIXAR A PARTE IMPORTANTE DE FORA</p><h2>O que você precisa saber.</h2></div><div>{[['Meu cliente precisa autorizar?','Sim. O caminho apresentado depende da autorização da assinatura no cartão. Cadastrar o cliente não substitui esse aceite.'],['E se a cobrança ficar pendente?','É preciso conferir a situação e o tratamento aplicável. A cobrança recorrente não garante que todos os pagamentos serão aprovados.'],['Já tenho assinantes. Posso avaliar?','Sim. A conversa deve considerar seus planos, como você cobra hoje e as ações necessárias de cada cliente. Não há promessa de transferência automática de cartões.'],['Preciso assistir a um curso antes?','Não. Você pode pedir uma avaliação diretamente. Conteúdo educativo pode ajudar, mas não é uma exigência para conversar.'],['Qual é o investimento e o que está incluído?','O time precisa apresentar a composição do plano, condições e escopo aplicáveis à sua operação antes da contratação. Esta prévia não estabelece uma oferta comercial.']].map(([title,text])=><details key={title}><summary>{title}<span>+</span></summary><p>{text}</p></details>)}</div></section>
    <section id="avaliar" className={styles.contact}><div><p className={styles.eyebrow}>O PRÓXIMO PASSO É SOBRE A SUA BARBEARIA</p><h2>Vamos olhar como<br/>você cobra hoje?</h2><p>Conte sua situação para avaliarmos o caminho da cobrança recorrente no seu clube.</p><div className={styles.contactNote}><MessageCircle size={23}/><p>Na operação planejada, o primeiro atendimento será com Lucas, assistente virtual da BestBarbers, com supervisão do time.</p></div></div><div data-reveal className={styles.formCard}><span className={styles.formBadge}>FORMULÁRIO DE TESTE · SEM ENVIO</span>{sent?<div className={styles.success} role="status"><ShieldCheck size={42}/><h3>Você chegou ao fim do teste.</h3><p>Nenhum dado foi enviado e nenhum atendimento foi aberto.</p><button onClick={()=>{setSent(false);setName('')}}>Testar novamente <RotateCcw size={16}/></button></div>:<form onSubmit={submit}><h3>Experimente o pedido de avaliação</h3><p>Use dados fictícios nesta prévia.</p><label htmlFor="preview-name">Como podemos chamar você?</label><input id="preview-name" value={name} onChange={e=>setName(e.target.value)} required maxLength={80} autoComplete="off" placeholder="Seu nome de exemplo"/><label htmlFor="preview-situation">Como funciona a cobrança hoje?</label><select id="preview-situation" defaultValue="manual"><option value="manual">Já tenho clube e cobro manualmente</option><option value="sistema">Já uso outro sistema</option><option value="comecar">Ainda vou começar meu clube</option></select><label htmlFor="preview-team">Quem trabalha na barbearia?</label><select id="preview-team" required defaultValue=""><option value="" disabled>Selecione uma situação</option><option>Trabalho sozinho</option><option>Tenho uma equipe</option><option>Estou montando a equipe</option></select><button className={styles.primary} type="submit">Simular pedido de avaliação <ArrowRight size={18}/></button><small>O teste acontece somente nesta página. Não solicitamos telefone, cartão ou pagamento.</small></form>}</div></section>
    <footer className={styles.footer}><Image src="/images/Logo-BestBarbers-branco_1.webp" alt="BestBarbers" width={140} height={32}/><p>Clube de assinatura, com clareza sobre a operação.</p><span>Preview local · conceito visual em validação</span></footer>
  </main>;
}
