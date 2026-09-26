import { siteConfig, formatAddressOneLine } from '@/lib/config/site';
import { loanLimits } from '@/lib/config/loans';
import type { LocaleContent } from './types';

const company = siteConfig.legalName;
const address = formatAddressOneLine();
const email = siteConfig.contact.email;
const phone = siteConfig.contact.phoneDisplay;
const min = loanLimits.minAmount.toLocaleString('en-GB');
const max = loanLimits.maxAmount.toLocaleString('en-GB');
const docs = ['Valid identity document (national ID card or passport)', 'Proof of address dated within the last 3 months', 'Proof of income (last 3 payslips or tax assessment)'];
const updated = '26 September 2026';

export const en: LocaleContent = {
  products: {
    'pret-personnel': {
      name: 'Personal loan', shortName: 'Personal', tagline: 'Finance your plans, on your own terms.',
      description: 'Flexible financing with no restrictions on use, to make your personal plans happen: travel, a wedding, studies, unexpected expenses or a cash-flow gap.',
      longDescription: 'An Express Finance personal loan lets you borrow a set amount and repay it in fixed monthly instalments over a term of your choosing. You are free to use the funds as you wish, with personalised support from application through to disbursement.',
      keyConditions: ['Fixed monthly instalments for the whole term', 'No restriction on how the funds are used', 'Personalised assessment of every application', 'Early repayment possible under the terms of the agreement'],
      useCases: ['Personal cash flow', 'Family event', 'Studies and training', 'Travel'], requiredDocuments: docs,
    },
    'credit-immobilier': {
      name: 'Mortgage', shortName: 'Property', tagline: 'Make your property plans a reality.',
      description: 'Purchase, new build, renovation or buy-to-let: structured property financing tailored to your circumstances.',
      longDescription: 'Our mortgages cover the purchase of a main or second home, a new build, renovation work or a buy-to-let investment. Every application is analysed in depth so that we can propose a financing plan in line with your ability to repay.',
      keyConditions: ['Finances purchase, new build or renovation', 'Long terms available depending on the project', 'Detailed analysis of the financing plan', 'Security agreed during the application review'],
      useCases: ['Main residence', 'Buy-to-let investment', 'Renovation', 'New build'], requiredDocuments: [...docs, 'Sale agreement, quote or description of the property project'],
    },
    'credit-consommation': {
      name: 'Consumer credit', shortName: 'Consumer', tagline: 'Buy what you need, without the wait.',
      description: 'Vehicle, equipment, appliances, home improvements: financing dedicated to the purchase of a specific item or service.',
      longDescription: 'Consumer credit finances a specific purchase — a vehicle, furniture, equipment or home improvements. The amount and term are matched to the value of the item and to your monthly budget.',
      keyConditions: ['Financing tied to a specific purchase', 'Monthly instalments matched to your budget', 'Proof of purchase (quote or invoice) required', 'Final terms set once the application has been reviewed'],
      useCases: ['Vehicle', 'Home improvements', 'Equipment', 'Furniture'], requiredDocuments: [...docs, 'Quote or order form for the item being financed'],
    },
    'financement-professionnel': {
      name: 'Business financing', shortName: 'Business', tagline: 'Fuel the growth of your business.',
      description: 'Cash flow, investment, equipment, business development: financing solutions for the self-employed, micro-businesses and SMEs.',
      longDescription: 'Express Finance supports entrepreneurs, the self-employed and companies with their financing needs: shoring up cash flow, acquiring equipment, growing the business or buying a company. Applications are assessed on the basis of the company’s financial information.',
      keyConditions: ['Open to the self-employed, micro-businesses and SMEs', 'Cash-flow or investment financing', 'Analysis of the company’s financial statements', 'Repayment plan adapted to your business cycle'],
      useCases: ['Cash flow', 'Machinery and equipment', 'Business development', 'Business acquisition'],
      requiredDocuments: ['Identity document of the company director', 'Company registration extract or equivalent', 'Latest balance sheets or annual accounts', 'Recent business bank statements'],
    },
    'financement-de-projet': {
      name: 'Project financing', shortName: 'Project', tagline: 'Turn an idea into reality.',
      description: 'Start-up, innovation, agricultural, property or industrial project: financing structured around your business plan.',
      longDescription: 'Project financing is designed for the sponsors of well-structured projects with a clear plan: starting a business, developing a product, or an agricultural, energy or industrial project. The assessment covers the project’s viability, its timeline and its ability to generate the cash flow needed for repayment.',
      keyConditions: ['Project presentation document required', 'Assessment of viability and timeline', 'Financing can be released in stages', 'Dedicated support throughout the assessment'],
      useCases: ['Starting a business', 'Agricultural project', 'Energy project', 'Product development'],
      requiredDocuments: ['Identity document of the project sponsor', 'Presentation document / business plan', 'Financial forecasts', 'Evidence of any personal contribution'],
    },
    'autres-solutions': {
      name: 'Other financing solutions', shortName: 'Bespoke', tagline: 'A specific need? Let’s talk.',
      description: 'Debt consolidation, funding for studies, unusual circumstances: we consider applications that do not fit the standard categories.',
      longDescription: 'Some situations call for a bespoke approach: consolidating existing loans, funding a course of study, a one-off need or an unusual project. Tell us what you need and our team will assess whether a suitable solution can be put in place.',
      keyConditions: ['Case-by-case assessment', 'Solution built around your circumstances', 'Full transparency on the proposed terms', 'Personalised response after analysis'],
      useCases: ['Debt consolidation', 'Funding for studies', 'One-off need', 'Unusual project'], requiredDocuments: docs,
    },
  },
  faq: [
    { id: 'montants', question: 'What amounts can I apply for?', answer: `Financing applications are considered for amounts between €${min} and €${max}, depending on the type of financing and your circumstances. The amount granted always depends on the assessment of your application.` },
    { id: 'taux', question: 'What rate is applied?', answer: 'Express Finance applies a fixed nominal annual interest rate of 2%, with equal monthly instalments over the whole term of the loan. The precise terms (repayment term, any fees) are confirmed in the offer issued once your application has been reviewed.' },
    { id: 'frais', question: 'Are there any fees on top of the interest?', answer: 'Arrangement fees may apply depending on the type of financing and the applicable legal and contractual framework. They are always communicated in writing before anything is signed: no hidden fees, and no payment is required before the offer is issued.' },
    { id: 'delai', question: 'How long does the review take?', answer: 'Once we have received your complete application, an adviser will give you an initial response within two working days. The time it takes to release the funds then depends on the type of financing and the signing of the offer.' },
    { id: 'documents', question: 'What documents do I need to provide?', answer: 'As a rule: a valid identity document, recent proof of address and proof of income. Additional documents may be requested depending on the project (quotes, sale agreement, financial statements for companies).' },
    { id: 'garantie', question: 'Is my application guaranteed to be accepted?', answer: 'No. Every application is assessed individually. Express Finance reserves the right to accept or decline an application after analysing the applicant’s circumstances and the feasibility of the project.' },
    { id: 'international', question: 'Can I apply from another country?', answer: 'Yes. Express Finance is an international financing company supporting clients in Europe and beyond. Indicate your country of residence in the form and we will confirm the terms that apply to your situation.' },
    { id: 'donnees', question: 'How is my personal data protected?', answer: 'Your data is encrypted in transit, stored on secure infrastructure and accessible only to people authorised to process your application. See our privacy policy for details of your rights.' },
  ],
  testimonials: [
    { loanType: 'Business financing', content: 'I needed cash flow quickly to fulfil a large order. My application was reviewed in two days and my adviser explained every line of the offer. No surprises.' },
    { loanType: 'Personal loan', content: 'Clear simulation, simple form and genuine follow-up on WhatsApp. I appreciated being told from the outset what was possible and what wasn’t.' },
    { loanType: 'Mortgage', content: 'We financed the renovation of our flat. The team was available, precise about the fees and quick to respond. I’d recommend them.' },
    { loanType: 'Consumer credit', content: 'Financing my car was completely hassle-free. The monthly instalments match the simulation on the website exactly.' },
    { loanType: 'Project financing', content: 'To launch my business I needed someone who understood my business plan. Attentive, rigorous and quick to respond: exactly what I needed.' },
    { loanType: 'Personal loan', content: '100% online process, documents uploaded in five minutes and an answer two days later. The fixed rate meant I could plan my budget with complete peace of mind.' },
  ],
  legal: {
    mentions: {
      title: 'Legal notice', description: 'Legal notice for the Express Finance website: publisher, hosting, intellectual property and liability.', lastUpdated: updated,
      sections: [
        { heading: '1. Website publisher', paragraphs: [`This website is published by ${company}, an international financing company whose registered office is at ${address}.`], list: [`E-mail: ${email}`, `Phone: ${phone}`, 'Responsible for publication: the management of Express Finance'] },
        { heading: '2. Hosting', paragraphs: ['The website is hosted on European cloud infrastructure (Vercel Inc. for the application, Supabase Inc. for the database and secure document storage), on servers located in the European Union.'] },
        { heading: '3. Activity', paragraphs: [`${company} offers financing solutions — personal loans, mortgages, consumer credit, business and project financing — for individuals, the self-employed and companies. Every application is assessed individually; no offer is issued without prior analysis of the application.`] },
        { heading: '4. Intellectual property', paragraphs: [`All content on this website (text, images, logo, structure, code and simulator) is protected by copyright and remains the exclusive property of ${company} or its partners. Any reproduction, representation, adaptation or use, in whole or in part, without prior written authorisation is prohibited and constitutes an infringement.`] },
        { heading: '5. Liability', paragraphs: [`The information published on this website is provided for information purposes only. ${company} endeavours to keep it accurate and up to date but cannot guarantee that it is complete or free from error. Loan simulations are indicative and do not constitute a credit offer.`, `${company} cannot be held liable for any direct or indirect loss arising from access to, use of or inability to access the website, nor for the content of any third-party websites it may link to.`] },
        { heading: '6. Personal data', paragraphs: ['The processing of personal data collected on this website is described in the privacy policy, which can be accessed from the footer.'] },
        { heading: '7. Contact', paragraphs: [`For any questions about the website or its content: ${email}.`] },
      ],
    },
    privacy: {
      title: 'Privacy policy', description: 'How Express Finance collects, uses and protects your personal data in connection with your financing application.', lastUpdated: updated,
      sections: [
        { heading: '1. Data controller', paragraphs: [`The controller of the data collected through this website is ${company}, ${address} — ${email}.`] },
        { heading: '2. Data collected', paragraphs: ['As part of a financing application, we collect:'], list: ['Identity and contact details: first name, last name, postal address, e-mail address, phone number;', 'Employment details: occupation, employment status, declared monthly income;', 'Project: type of financing, amount, term, project description;', 'Documents: identity document and, where applicable, proof of address and proof of income;', 'Technical data: hashed fingerprint of the IP address and browser used (security and fraud prevention), and timestamps of consents.'], after: ['No sensitive data within the meaning of the GDPR (health, opinions, affiliations) is requested.'] },
        { heading: '3. Purposes and legal bases', list: ['Assessment and processing of your financing application (pre-contractual steps taken at your request);', 'Contact and follow-up of your application by e-mail, phone or WhatsApp;', 'Website security and the prevention of abuse and fraud (legitimate interest);', 'Compliance with our legal and regulatory obligations.'] },
        { heading: '4. Recipients', paragraphs: [`Your data is accessible only to authorised staff of ${company} and to our technical processors (hosting, database and secure storage). Where structuring a financing arrangement requires it, strictly necessary information may be passed to a partner institution, after you have been informed. No data is sold or passed on for commercial purposes.`] },
        { heading: '5. Retention period', paragraphs: ['Application data is kept for the duration of the assessment and then, if no contract is entered into, for a maximum of 12 months before being deleted or anonymised. If financing is granted, it is kept for the duration of the contract and for the applicable statutory retention period (10 years for accounting records).'] },
        { heading: '6. Security', paragraphs: ['Data is encrypted in transit (HTTPS) and stored in a database protected by strict access rules; documents are held in a private storage space accessible only via temporary links generated for authorised staff.'] },
        { heading: '7. Your rights', paragraphs: [`Under the GDPR, you have the right to access, rectify, erase and port your data, to restrict or object to its processing, and to withdraw your consent at any time. To exercise these rights, contact ${email}. You may also lodge a complaint with the Belgian Data Protection Authority (www.dataprotectionauthority.be) or the competent authority in your country of residence.`] },
        { heading: '8. Transfers outside the European Union', paragraphs: ['Data is hosted in the European Union. Should a transfer outside the EU become necessary (for example, to a technical processor), it would be covered by appropriate safeguards (European Commission standard contractual clauses).'] },
        { heading: '9. Cookies', paragraphs: ['The use of cookies is described in our cookie policy.'] },
      ],
    },
    terms: {
      title: 'Terms and conditions of use', description: 'Terms and conditions of use for the Express Finance website and the online financing application service.', lastUpdated: updated,
      sections: [
        { heading: '1. Purpose', paragraphs: [`These terms govern the use of the ${siteConfig.name} website and the online financing application service. By using the website, you accept them in full.`] },
        { heading: '2. Nature of the service', paragraphs: [`The website allows you to find out about the financing solutions on offer, to run an indicative simulation and to submit a financing application. Submitting an application constitutes neither an offer nor a credit agreement: it opens an assessment phase at the end of which ${company} may accept the application, decline it or propose different terms.`] },
        { heading: '3. Simulator', paragraphs: ['The simulator provides estimates calculated from the parameters shown (fixed nominal annual rate of 2%, term, any fees). These results are indicative and non-binding, and may differ from the terms ultimately offered.'] },
        { heading: '4. User obligations', list: ['Provide accurate, complete and up-to-date information;', 'Only submit documents that belong to you or that you are authorised to share;', 'Not use the website for fraudulent, abusive or unlawful purposes;', 'Not attempt to compromise the security or operation of the website.'] },
        { heading: '5. Fees', paragraphs: ['Use of the website and submission of an application are free of charge. Arrangement fees may apply to the financing itself, where provided for by law and by contract; they are communicated in writing before you make any commitment. No payment is required before the offer is issued.'] },
        { heading: '6. Liability', paragraphs: [`${company} takes reasonable steps to ensure the availability and security of the website, but does not guarantee uninterrupted access. It cannot be held liable for any indirect loss arising from use of the website or inability to access it.`] },
        { heading: '7. Intellectual property', paragraphs: ['See the legal notice.'] },
        { heading: '8. Personal data', paragraphs: ['The processing of your data is described in the privacy policy.'] },
        { heading: '9. Applicable law and jurisdiction', paragraphs: ['These terms are governed by Belgian law. Any dispute concerning their interpretation or performance falls within the jurisdiction of the courts of Brussels, subject to any mandatory consumer-protection rules applicable in your country of residence.'] },
      ],
    },
    cookies: {
      title: 'Cookie policy', description: 'Information about the cookies and tracking technologies used by the Express Finance website.', lastUpdated: updated,
      sections: [
        { heading: '1. What is a cookie?', paragraphs: ['A cookie is a small file placed on your device when you visit a website. It is used, among other things, to maintain a session or remember your preferences.'] },
        { heading: '2. Cookies used on this website', paragraphs: ['The public website uses no advertising cookies and no third-party analytics cookies. The only cookies placed are strictly necessary ones:'], list: ['Administration session cookies: placed only when logging in to the area reserved for Express Finance staff. They do not affect visitors.', 'Security check: a technical token may be used for verification when the application form is submitted.'], after: ['As these cookies are strictly necessary for the service to operate, they do not require prior consent.'] },
        { heading: '3. Simulator', paragraphs: ['The simulator runs entirely in your browser and does not retain your parameters once the page is closed.'] },
        { heading: '4. Managing cookies', paragraphs: ['You can set your browser to refuse or delete cookies. Blocking strictly necessary cookies may prevent access to the administration area.'] },
      ],
    },
    disclaimer: {
      title: 'Loan disclaimer', description: 'Important information before you apply for financing: indicative simulations, application review and your repayment commitment.', lastUpdated: updated,
      sections: [
        { heading: 'Borrowing is a commitment', paragraphs: ['Borrowing money also costs money. Before you commit, check that you can afford the repayments and make sure the monthly instalments fit within your budget for the entire term of the financing.'] },
        { heading: 'Indicative simulations', paragraphs: [`Simulator results are estimates calculated from the parameters shown. They constitute neither an offer, nor a promise of financing, nor a commitment on the part of ${company}. Final terms (rate, term, fees, security) are set out in the written offer issued once the application has been fully reviewed.`] },
        { heading: 'Individual assessment', paragraphs: [`Every application is assessed individually. ${company} reserves the right to decline financing or to change its terms at the end of the assessment.`] },
        { heading: 'Fees and penalties', paragraphs: ['Arrangement fees may apply where provided for by law and by contract; they are announced before you make any commitment. In the event of late payment, penalties are due under the terms of the agreement. Amounts shown by the penalty simulator are estimates and depend on the terms of your contract.'] },
        { heading: 'Stay alert', paragraphs: [`${company} will never ask you to share your banking credentials by e-mail or message, or to pay any sum before a written offer has been issued. If you have any doubt about the authenticity of a communication, contact us directly using the official details on this website.`] },
      ],
    },
  },
};
