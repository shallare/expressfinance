import { siteConfig, formatAddressOneLine } from '@/lib/config/site';
import { loanLimits } from '@/lib/config/loans';
import type { LocaleContent } from './types';

const company = siteConfig.legalName;
const address = formatAddressOneLine();
const email = siteConfig.contact.email;
const phone = siteConfig.contact.phoneDisplay;
const min = loanLimits.minAmount.toLocaleString('pt-PT');
const max = loanLimits.maxAmount.toLocaleString('pt-PT');
const docs = ['Documento de identificação válido (cartão de cidadão ou passaporte)', 'Comprovativo de morada com menos de 3 meses', 'Comprovativos de rendimentos (últimos 3 recibos de vencimento ou nota de liquidação de IRS)'];
const updated = '26 de setembro de 2026';

export const pt: LocaleContent = {
  products: {
    'pret-personnel': {
      name: 'Empréstimo pessoal', shortName: 'Pessoal', tagline: 'Financie os seus projetos de vida com total liberdade.',
      description: 'Um financiamento flexível e sem finalidade específica para concretizar os seus projetos pessoais: viagem, casamento, estudos, imprevistos ou necessidades de liquidez.',
      longDescription: 'O empréstimo pessoal Express Finance permite-lhe obter um montante definido, reembolsável em prestações mensais fixas ao longo do prazo que escolher. É livre de utilizar os fundos como entender e beneficia de um acompanhamento personalizado, desde o pedido até à disponibilização dos fundos.',
      keyConditions: ['Prestações mensais fixas durante todo o prazo', 'Livre utilização dos fundos', 'Análise personalizada de cada processo', 'Reembolso antecipado possível, nas condições contratuais'],
      useCases: ['Necessidades de liquidez', 'Evento familiar', 'Estudos e formação', 'Viagem'], requiredDocuments: docs,
    },
    'credit-immobilier': {
      name: 'Crédito habitação', shortName: 'Habitação', tagline: 'Dê vida ao seu projeto imobiliário.',
      description: 'Compra, construção, renovação ou investimento para arrendamento: uma solução de financiamento imobiliário estruturada e adaptada à sua situação.',
      longDescription: 'A nossa oferta de crédito habitação acompanha a aquisição de habitação própria permanente ou secundária, a construção, a renovação ou o investimento para arrendamento. Cada processo é objeto de uma análise aprofundada, para lhe propormos um plano de financiamento coerente com a sua capacidade de reembolso.',
      keyConditions: ['Financiamento da compra, da construção ou da renovação', 'Prazos longos possíveis consoante o projeto', 'Análise detalhada do plano de financiamento', 'Garantias definidas durante a análise do processo'],
      useCases: ['Habitação própria', 'Investimento para arrendamento', 'Renovação', 'Construção'], requiredDocuments: [...docs, 'Contrato-promessa, orçamento ou descrição do projeto imobiliário'],
    },
    'credit-consommation': {
      name: 'Crédito ao consumo', shortName: 'Consumo', tagline: 'Compre já, sem esperar.',
      description: 'Veículo, equipamento, eletrodomésticos, obras: um financiamento dedicado à compra de um bem ou serviço específico.',
      longDescription: 'O crédito ao consumo financia uma compra identificada — veículo, mobiliário, equipamento, obras de remodelação. O montante e o prazo são ajustados ao valor do bem e ao seu orçamento mensal.',
      keyConditions: ['Financiamento afeto a uma compra identificada', 'Prestações mensais adaptadas ao seu orçamento', 'Comprovativo de compra (orçamento ou fatura) solicitado', 'Condições definitivas fixadas após análise do processo'],
      useCases: ['Veículo', 'Obras de remodelação', 'Equipamento', 'Mobiliário'], requiredDocuments: [...docs, 'Orçamento ou nota de encomenda do bem financiado'],
    },
    'financement-professionnel': {
      name: 'Financiamento empresarial', shortName: 'Empresarial', tagline: 'Apoie o crescimento da sua empresa.',
      description: 'Tesouraria, investimento, equipamento, desenvolvimento comercial: soluções de financiamento para independentes, microempresas e PME.',
      longDescription: 'A Express Finance acompanha empreendedores, independentes e sociedades nas suas necessidades de financiamento: reforço de tesouraria, aquisição de equipamento, desenvolvimento da atividade ou aquisição de empresa. O processo é analisado com base nos elementos financeiros da empresa.',
      keyConditions: ['Aberto a independentes, microempresas e PME', 'Financiamento de tesouraria ou de investimento', 'Análise dos documentos financeiros da empresa', 'Plano de reembolso adaptado ao ciclo de atividade'],
      useCases: ['Tesouraria', 'Máquinas e equipamento', 'Desenvolvimento comercial', 'Aquisição de negócio'],
      requiredDocuments: ['Documento de identificação do gerente', 'Certidão permanente ou equivalente', 'Últimos balanços ou contas anuais', 'Extratos bancários recentes da empresa'],
    },
    'financement-de-projet': {
      name: 'Financiamento de projeto', shortName: 'Projeto', tagline: 'Transforme uma ideia numa realização concreta.',
      description: 'Lançamento de atividade, projeto inovador, agrícola, imobiliário ou industrial: um financiamento estruturado em torno do seu plano de projeto.',
      longDescription: 'O financiamento de projeto destina-se a promotores de projetos estruturados com um plano claro: criação de atividade, desenvolvimento de um produto, projeto agrícola, energético ou industrial. A análise incide sobre a viabilidade do projeto, o seu calendário e a sua capacidade de gerar os fluxos financeiros necessários ao reembolso.',
      keyConditions: ['Dossiê de apresentação do projeto obrigatório', 'Análise da viabilidade e do calendário', 'Financiamento escalonável por fases', 'Acompanhamento dedicado ao longo de toda a análise'],
      useCases: ['Criação de atividade', 'Projeto agrícola', 'Projeto energético', 'Desenvolvimento de produto'],
      requiredDocuments: ['Documento de identificação do promotor', 'Dossiê de apresentação / plano de negócios', 'Projeções financeiras', 'Comprovativos de capitais próprios, se aplicável'],
    },
    'autres-solutions': {
      name: 'Outras soluções de financiamento', shortName: 'À medida', tagline: 'Uma necessidade específica? Fale connosco.',
      description: 'Consolidação de créditos, financiamento de estudos, situação atípica: analisamos os pedidos que não se enquadram nas categorias clássicas.',
      longDescription: 'Algumas situações exigem uma abordagem à medida: consolidação de créditos, financiamento de um percurso de estudos, necessidade pontual ou projeto atípico. Descreva-nos a sua necessidade e a nossa equipa avalia a viabilidade de uma solução adequada.',
      keyConditions: ['Análise caso a caso', 'Solução construída em torno da sua situação', 'Transparência total sobre as condições propostas', 'Resposta personalizada após análise'],
      useCases: ['Consolidação de créditos', 'Financiamento de estudos', 'Necessidade pontual', 'Projeto atípico'], requiredDocuments: docs,
    },
  },
  faq: [
    { id: 'montants', question: 'Que montantes posso pedir?', answer: `Os pedidos de financiamento são analisados para montantes entre ${min} € e ${max} €, consoante o tipo de financiamento e a sua situação. O montante concedido depende sempre da análise do seu processo.` },
    { id: 'taux', question: 'Qual é a taxa aplicada?', answer: 'A Express Finance aplica uma taxa de juro nominal anual fixa de 2 %, com prestações mensais constantes durante todo o prazo do empréstimo. As modalidades exatas (prazo, eventuais custos) são confirmadas na proposta entregue após análise do seu processo.' },
    { id: 'frais', question: 'Há custos além dos juros?', answer: 'Podem aplicar-se comissões e encargos consoante o tipo de financiamento e o enquadramento legal e contratual aplicável. São sempre comunicados por escrito antes de qualquer assinatura: sem custos ocultos e sem qualquer pagamento exigido antes da entrega da proposta.' },
    { id: 'delai', question: 'Quanto tempo demora a análise de um pedido?', answer: 'Após a receção do seu processo completo, um consultor dá-lhe uma resposta preliminar no prazo de 48 horas úteis. O prazo de disponibilização dos fundos depende, depois, do tipo de financiamento e da assinatura da proposta.' },
    { id: 'documents', question: 'Que documentos devo fornecer?', answer: 'Em geral: um documento de identificação válido, um comprovativo de morada recente e comprovativos de rendimentos. Podem ser solicitados documentos complementares consoante o projeto (orçamentos, contrato-promessa, balanços para empresas).' },
    { id: 'garantie', question: 'O meu pedido é aceite automaticamente?', answer: 'Não. Cada pedido é objeto de uma análise individual. A Express Finance reserva-se o direito de aceitar ou recusar um pedido após análise da situação do requerente e da viabilidade do projeto.' },
    { id: 'international', question: 'Posso fazer um pedido a partir de outro país?', answer: 'Sim. A Express Finance é uma empresa de financiamento de vocação internacional que acompanha clientes na Europa e fora dela. Indique o seu país de residência no formulário: esclarecemos as modalidades aplicáveis à sua situação.' },
    { id: 'donnees', question: 'Como são protegidos os meus dados pessoais?', answer: 'Os seus dados são transmitidos de forma cifrada, armazenados numa infraestrutura segura e acessíveis apenas às pessoas autorizadas a tratar o seu pedido. Consulte a nossa política de privacidade para conhecer os seus direitos em detalhe.' },
  ],
  testimonials: [
    { loanType: 'Financiamento empresarial', content: 'Precisava de tesouraria rapidamente para honrar uma encomenda importante. O processo foi analisado em dois dias e o meu consultor explicou-me cada linha da proposta. Sem surpresas.' },
    { loanType: 'Empréstimo pessoal', content: 'Simulação clara, formulário simples e um verdadeiro acompanhamento por WhatsApp. Apreciei que me dissessem desde o início o que era possível ou não.' },
    { loanType: 'Crédito habitação', content: 'Financiámos a renovação do nosso apartamento. A equipa esteve disponível, foi clara quanto aos custos e rápida nas respostas. Recomendo.' },
    { loanType: 'Crédito ao consumo', content: 'Financiamento do meu veículo sem complicações. As prestações mensais correspondem exatamente à simulação feita no site.' },
    { loanType: 'Financiamento de projeto', content: 'Para lançar a minha atividade, precisava de um interlocutor que compreendesse o meu plano de negócios. Capacidade de escuta, rigor e resposta rápida: exatamente aquilo de que precisava.' },
    { loanType: 'Empréstimo pessoal', content: 'Processo 100 % online, documentos carregados em cinco minutos e resposta em dois dias. A taxa fixa permitiu-me planear o meu orçamento com serenidade.' },
  ],
  legal: {
    mentions: {
      title: 'Aviso legal', description: 'Aviso legal do site Express Finance: entidade responsável, alojamento, propriedade intelectual, responsabilidade.', lastUpdated: updated,
      sections: [
        { heading: '1. Entidade responsável pelo site', paragraphs: [`O presente site é propriedade de ${company}, empresa internacional de financiamento com sede em ${address}.`], list: [`E-mail: ${email}`, `Telefone: ${phone}`, 'Responsável pela publicação: a Direção da Express Finance'] },
        { heading: '2. Alojamento', paragraphs: ['O site está alojado numa infraestrutura cloud europeia (Vercel Inc. para a aplicação, Supabase Inc. para a base de dados e o armazenamento seguro de documentos), em servidores situados na União Europeia.'] },
        { heading: '3. Atividade', paragraphs: [`A ${company} disponibiliza soluções de financiamento — empréstimos pessoais, crédito habitação, crédito ao consumo, financiamento de empresas e projetos — destinadas a particulares, independentes e empresas. Cada pedido é objeto de uma análise individual; nenhuma proposta é emitida sem análise prévia do processo.`] },
        { heading: '4. Propriedade intelectual', paragraphs: [`Todo o conteúdo do site (textos, imagens, logótipo, estrutura, código, simulador) está protegido pelo direito de autor e permanece propriedade exclusiva da ${company} ou dos seus parceiros. Qualquer reprodução, representação, adaptação ou exploração, total ou parcial, sem autorização escrita prévia é proibida e constitui contrafação.`] },
        { heading: '5. Responsabilidade', paragraphs: [`As informações difundidas neste site são fornecidas a título informativo. A ${company} esforça-se por as manter exatas e atualizadas, mas não pode garantir a sua exaustividade nem a ausência de erros. As simulações de empréstimo são indicativas e não constituem uma oferta de crédito.`, `A ${company} não pode ser responsabilizada por danos diretos ou indiretos resultantes do acesso ao site, da sua utilização ou da impossibilidade de aceder, nem pelo conteúdo de sites de terceiros para os quais possa remeter.`] },
        { heading: '6. Dados pessoais', paragraphs: ['O tratamento dos dados pessoais recolhidos neste site está descrito na política de privacidade, acessível a partir do rodapé.'] },
        { heading: '7. Contacto', paragraphs: [`Para qualquer questão relativa ao site ou ao seu conteúdo: ${email}.`] },
      ],
    },
    privacy: {
      title: 'Política de privacidade', description: 'Como a Express Finance recolhe, utiliza e protege os seus dados pessoais no âmbito do seu pedido de financiamento.', lastUpdated: updated,
      sections: [
        { heading: '1. Responsável pelo tratamento', paragraphs: [`O responsável pelo tratamento dos dados recolhidos através deste site é a ${company}, ${address} — ${email}.`] },
        { heading: '2. Dados recolhidos', paragraphs: ['No âmbito de um pedido de financiamento, recolhemos:'], list: ['Identidade e contactos: nome próprio, apelido, morada postal, e-mail, telefone;', 'Situação profissional: profissão, situação, rendimento mensal declarado;', 'Projeto: tipo de financiamento, montante, prazo, descrição do projeto;', 'Comprovativos: documento de identificação e, se for caso disso, comprovativos de morada e de rendimentos;', 'Dados técnicos: identificador cifrado (hash) do endereço IP e do navegador utilizado (segurança e prevenção de fraude), data e hora dos consentimentos.'], after: ['Não é solicitado nenhum dado sensível na aceção do RGPD (saúde, opiniões políticas, filiação sindical).'] },
        { heading: '3. Finalidades e bases jurídicas', list: ['Análise e tratamento do seu pedido de financiamento (diligências pré-contratuais a seu pedido);', 'Contacto e acompanhamento do processo por e-mail, telefone ou WhatsApp;', 'Segurança do site, prevenção de abusos e de fraude (interesse legítimo);', 'Cumprimento das nossas obrigações legais e regulamentares.'] },
        { heading: '4. Destinatários', paragraphs: [`Os seus dados são acessíveis apenas ao pessoal autorizado da ${company} e aos nossos subcontratantes técnicos (alojamento, base de dados e armazenamento seguro). Quando a estruturação de um financiamento o exige, os elementos estritamente necessários podem ser transmitidos a uma instituição parceira, mediante informação prévia. Nenhum dado é vendido nem cedido para fins comerciais.`] },
        { heading: '5. Prazo de conservação', paragraphs: ['Os dados de um pedido são conservados durante a análise do pedido e, na ausência de contrato, durante 12 meses no máximo antes da eliminação ou anonimização. Em caso de financiamento concedido, são conservados durante a vigência do contrato e o prazo legal de conservação aplicável (10 anos para os documentos contabilísticos).'] },
        { heading: '6. Segurança', paragraphs: ['Os dados são transmitidos de forma cifrada (HTTPS), armazenados numa base protegida por regras de acesso rigorosas, e os comprovativos são guardados num espaço de armazenamento privado, acessível apenas através de ligações temporárias geradas para as pessoas autorizadas.'] },
        { heading: '7. Os seus direitos', paragraphs: [`Em conformidade com o RGPD, dispõe do direito de acesso, retificação, apagamento, limitação, oposição e portabilidade dos seus dados, bem como do direito de retirar o seu consentimento a qualquer momento. Para exercer estes direitos: ${email}. Pode igualmente apresentar uma reclamação junto da Autoridade de Proteção de Dados belga (www.autoriteprotectiondonnees.be) ou da autoridade competente do seu país de residência.`] },
        { heading: '8. Transferências para fora da União Europeia', paragraphs: ['Os dados são alojados na União Europeia. Se uma transferência para fora da UE se revelar necessária (por exemplo, para um subcontratante técnico), será enquadrada por garantias adequadas (cláusulas contratuais-tipo da Comissão Europeia).'] },
        { heading: '9. Cookies', paragraphs: ['A utilização de cookies está descrita na nossa política de cookies.'] },
      ],
    },
    terms: {
      title: 'Condições gerais de utilização', description: 'Condições gerais de utilização do site Express Finance e do serviço de pedido de financiamento online.', lastUpdated: updated,
      sections: [
        { heading: '1. Objeto', paragraphs: [`As presentes condições regem a utilização do site ${siteConfig.name} e do serviço de pedido de financiamento online. Ao utilizar o site, aceita-as sem reservas.`] },
        { heading: '2. Natureza do serviço', paragraphs: [`O site permite-lhe informar-se sobre as soluções de financiamento propostas, realizar uma simulação indicativa e apresentar um pedido de financiamento. A apresentação de um pedido não constitui uma oferta nem um contrato de crédito: abre uma fase de análise no final da qual a ${company} pode aceitar, recusar ou propor condições diferentes.`] },
        { heading: '3. Simulador', paragraphs: ['O simulador fornece estimativas calculadas a partir dos parâmetros apresentados (taxa nominal anual fixa de 2 %, prazo, eventuais custos). Estes resultados são indicativos, não contratuais, e podem diferir das condições finalmente propostas.'] },
        { heading: '4. Obrigações do utilizador', list: ['Fornecer informações exatas, completas e atualizadas;', 'Transmitir apenas documentos de que é titular ou que está autorizado a comunicar;', 'Não utilizar o site para fins fraudulentos, abusivos ou contrários à lei;', 'Não tentar comprometer a segurança ou o funcionamento do site.'] },
        { heading: '5. Custos', paragraphs: ['A utilização do site e a apresentação de um pedido são gratuitas. Podem aplicar-se comissões e encargos ao próprio financiamento, quando legal e contratualmente previstos; são comunicados por escrito antes de qualquer compromisso. Nenhum pagamento é exigido antes da entrega da proposta.'] },
        { heading: '6. Responsabilidade', paragraphs: [`A ${company} adota os meios razoáveis para assegurar a disponibilidade e a segurança do site, sem garantia de ausência de interrupções. A sua responsabilidade não pode ser invocada por danos indiretos resultantes da utilização do site ou da impossibilidade de aceder.`] },
        { heading: '7. Propriedade intelectual', paragraphs: ['Ver o aviso legal.'] },
        { heading: '8. Dados pessoais', paragraphs: ['O tratamento dos seus dados está descrito na política de privacidade.'] },
        { heading: '9. Lei aplicável e jurisdição', paragraphs: ['As presentes condições estão sujeitas ao direito belga. Qualquer litígio relativo à sua interpretação ou execução é da competência dos tribunais de Bruxelas, sem prejuízo das disposições imperativas de proteção do consumidor aplicáveis no seu país de residência.'] },
      ],
    },
    cookies: {
      title: 'Política de cookies', description: 'Informações sobre os cookies e rastreadores utilizados pelo site Express Finance.', lastUpdated: updated,
      sections: [
        { heading: '1. O que é um cookie?', paragraphs: ['Um cookie é um pequeno ficheiro armazenado no seu dispositivo quando consulta um site. Permite nomeadamente manter uma sessão ou memorizar preferências.'] },
        { heading: '2. Cookies utilizados neste site', paragraphs: ['O site público não utiliza cookies publicitários nem cookies de medição de audiência de terceiros. Os únicos cookies utilizados são estritamente necessários:'], list: ['Cookies de sessão de administração: utilizados apenas no acesso à área reservada ao pessoal da Express Finance. Não dizem respeito aos visitantes.', 'Verificação anti-robô: um token técnico pode ser utilizado durante a verificação aquando do envio do formulário de pedido.'], after: ['Sendo estes cookies estritamente necessários ao funcionamento do serviço, não requerem consentimento prévio.'] },
        { heading: '3. Simulador', paragraphs: ['O simulador funciona inteiramente no seu navegador e não conserva os seus parâmetros após o fecho da página.'] },
        { heading: '4. Gestão dos cookies', paragraphs: ['Pode configurar o seu navegador para recusar ou eliminar cookies. O bloqueio dos cookies estritamente necessários pode impedir o acesso à área de administração.'] },
      ],
    },
    disclaimer: {
      title: 'Aviso sobre empréstimos', description: 'Informações importantes antes de qualquer pedido de financiamento: simulação indicativa, análise do processo, compromisso de reembolso.', lastUpdated: updated,
      sections: [
        { heading: 'Um crédito é um compromisso', paragraphs: ['Contrair um empréstimo tem custos. Antes de se comprometer, verifique a sua capacidade de reembolso e certifique-se de que as prestações mensais são compatíveis com o seu orçamento durante todo o prazo do financiamento.'] },
        { heading: 'Simulações indicativas', paragraphs: [`Os resultados do simulador são estimativas calculadas a partir dos parâmetros apresentados. Não constituem uma oferta, nem uma promessa de financiamento, nem um compromisso da ${company}. As condições definitivas (taxa, prazo, custos, garantias) constam da proposta escrita entregue após análise completa do processo.`] },
        { heading: 'Análise individual', paragraphs: [`Cada pedido é analisado individualmente. A ${company} reserva-se o direito de recusar um financiamento ou de alterar as suas condições no final da análise.`] },
        { heading: 'Custos e penalizações', paragraphs: ['Podem aplicar-se comissões e encargos quando legal e contratualmente previstos; são comunicados antes de qualquer compromisso. Em caso de atraso no pagamento, são devidas penalizações segundo o contrato. Os montantes apresentados pelo simulador de penalizações são estimativas e dependem das condições contratuais aplicáveis.'] },
        { heading: 'Atenção às fraudes', paragraphs: [`A ${company} nunca lhe pedirá que comunique as suas credenciais de acesso bancário por e-mail ou mensagem, nem que pague qualquer quantia antes da entrega de uma proposta escrita. Em caso de dúvida sobre a autenticidade de uma comunicação, contacte-nos diretamente através dos contactos oficiais indicados neste site.`] },
      ],
    },
  },
};
