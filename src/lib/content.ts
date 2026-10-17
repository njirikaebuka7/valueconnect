import { serviceImages } from "./images";

export type ServiceSlug = keyof typeof serviceImages;

export interface Service {
  slug: ServiceSlug;
  title: string;
  short: string;
  headline: string;
  card: string;
  intro: [string, string];
  included: string[];
  audience: string[];
  icon: "valuation" | "facility" | "agency" | "feasibility" | "land" | "auction";
}

export const services: Service[] = [
  {
    slug: "valuations",
    title: "Valuations",
    short: "Valuations",
    headline: "Unlock the true worth of your assets",
    icon: "valuation",
    card: "Independent, inspection-led valuations for lending, financial reporting, insurance, tax, transactions and disputes, signed and sealed.",
    intro: [
      "A valuation is only as strong as the evidence behind it and the name signed beneath it. Our ESVARBON-registered valuers inspect every property, review its title documents and build each figure from current market evidence. They then sign and seal the report, so accountability is never in doubt.",
      "We value land, residential, commercial and industrial property, and plant and machinery. Purposes include mortgage and loan security, financial reporting, insurance, mergers and acquisitions, compensation, taxation, probate, liquidation and sale or purchase decisions. Every report states its basis of value, assumptions and evidence in line with International and Nigerian Valuation Standards.",
    ],
    included: [
      "Physical inspection, measurement and photographic record",
      "Review of title, survey and planning documents, with gaps flagged",
      "Analysis of current comparable sales, rental and cost evidence",
      "Market Value, Forced Sale Value, fair value or reinstatement cost, as the purpose requires",
      "Clear statement of basis of value, assumptions and limitations",
      "A full report signed by a registered valuer with their ESVARBON seal and stamp",
      "Follow-up clarification for your lender, auditor or legal adviser",
    ],
    audience: [
      "Banks, mortgage institutions and their borrowers",
      "Companies, finance teams and auditors",
      "Insurers, brokers and owners reviewing cover",
      "Executors, families and legal practitioners",
      "Investors, buyers and sellers",
      "Government agencies and acquiring authorities",
    ],
  },
  {
    slug: "property-facility-management",
    title: "Property & Facility Management",
    short: "Facility Management",
    headline: "Maximise your asset's potential",
    icon: "facility",
    card: "Tenants, rent, maintenance and facility services managed to protect both your income and your building's long-term value.",
    intro: [
      "A well-run building holds its value; a neglected one quietly loses it. We manage residential, commercial and mixed-use property for owners in Nigeria and abroad. We handle tenants, rent, service charges and statutory obligations, so you are not chasing them yourself.",
      "On the facilities side, we plan and supervise maintenance, engage and oversee vetted contractors, and coordinate security, cleaning, power, water and waste. Because we are valuers, we manage with an eye on capital value as well as this month's rent, and you receive clear, regular reports on income, spending, occupancy and condition.",
    ],
    included: [
      "Tenant sourcing, referencing and lease administration",
      "Rent and service-charge collection, with transparent accounts",
      "Planned and reactive maintenance",
      "Contractor procurement and supervision",
      "Facility services: security, cleaning, power, water and waste",
      "Compliance support: Land Use Charge, insurance renewals and permits",
      "Periodic inspections, owner reports, rent reviews and renewals",
    ],
    audience: [
      "Individual landlords, including owners abroad",
      "Corporate and institutional owners",
      "Developers and residents' associations",
      "Family estates and trustees",
      "Lenders and receivers holding repossessed property",
    ],
  },
  {
    slug: "estate-agency",
    title: "Estate Agency",
    short: "Estate Agency",
    headline: "Your partner in Nigerian property transactions",
    icon: "agency",
    card: "Sales, lettings and acquisitions priced from market evidence, with documents reviewed before any property is marketed.",
    intro: [
      "In a market crowded with unregistered agents and optimistic asking prices, the safest transaction starts with a registered professional. We let, sell and acquire residential and commercial property, pricing every instruction from market evidence rather than guesswork.",
      "Before we market a property we review its documents; before you commit to one, we help you check them. We qualify buyers and tenants, negotiate price and terms, and work alongside your solicitor through to completion and Governor's Consent, so the property you pay for is the property you get.",
    ],
    included: [
      "Pricing advice based on current market evidence",
      "Document review before marketing",
      "Marketing, listings and accompanied viewings",
      "Buyer and tenant qualification and referencing",
      "Negotiation of price, rent and terms",
      "Coordination with solicitors through to completion",
      "Property search and acquisition for buyers and occupiers",
    ],
    audience: [
      "Owners selling or letting property",
      "Buyers and investors, including the diaspora",
      "Corporate occupiers seeking offices, retail or warehouses",
      "Developers marketing new schemes",
      "Families relocating to Lagos or Abuja",
      "Executors disposing of estate property",
    ],
  },
  {
    slug: "feasibility-viability-appraisal",
    title: "Feasibility & Viability Appraisal",
    short: "Feasibility Appraisal",
    headline: "Invest with confidence",
    icon: "feasibility",
    card: "Test demand, costs, returns and risk before you build, buy or lend, independently appraised and clearly reported.",
    intro: [
      "Many stalled projects looked fine on a spreadsheet. A feasibility and viability appraisal tests whether a proposed development or investment works in the real market: what will sell or let, at what price, how quickly, and at what cost to deliver.",
      "We combine site assessment, market research and financial modelling, including cash flow, NPV, IRR and payback. We then test the result against the variables that move most in Nigeria: construction costs, exchange rates, interest rates and sales pace, so you can put the report in front of lenders, investors and partners with confidence.",
    ],
    included: [
      "Site, location, access and planning review",
      "Market demand and supply study",
      "Highest and best use analysis",
      "Development cost and revenue estimates",
      "Cash flow modelling with NPV, IRR and payback",
      "Sensitivity testing on costs, FX, interest rates and absorption",
      "A report suitable for lenders, investors and JV partners",
    ],
    audience: [
      "Property developers",
      "Investors and joint-venture partners",
      "Landowners deciding whether to develop, sell or partner",
      "Banks and development finance institutions",
      "Public-sector and PPP sponsors",
      "Schools, hospitals and hotels planning premises",
    ],
  },
  {
    slug: "land-administration",
    title: "Land Administration",
    short: "Land Administration",
    headline: "Navigate Nigerian land law with ease",
    icon: "land",
    card: "C of O, Governor's Consent, surveys, regularisation and title perfection, handled from first search to registered document.",
    intro: [
      "Under the Land Use Act, an imperfect title is a risk to owners, buyers and lenders alike. A missing Governor's Consent, an uncharted survey or an unregularised grant can stall a sale, a mortgage or a compensation claim, and in Lagos it can also invite competing claims.",
      "We take you from first search to registered document. We check status at the Lands Registry and with the Surveyor-General, prepare and lodge applications for C of O, Governor's Consent and regularisation, coordinate surveys and follow your file through each stage, telling you plainly what is achievable and what to expect.",
    ],
    included: [
      "Land Registry searches and title status checks",
      "Survey coordination and charting with the Surveyor-General",
      "Certificate of Occupancy applications",
      "Governor's Consent for assignments, mortgages and subleases",
      "Regularisation and ratification of title",
      "Excision and gazette verification",
      "Follow-through to registration and collection",
    ],
    audience: [
      "Landowners without perfected title",
      "Buyers completing a purchase",
      "Banks perfecting mortgage security",
      "Developers assembling sites",
      "Owners living abroad",
      "Families regularising inherited land",
    ],
  },
  {
    slug: "auctioneering",
    title: "Auctioneering",
    short: "Auctioneering",
    headline: "Secure the best value through transparent sales",
    icon: "auction",
    card: "Transparent auctions of land, buildings, plant, machinery and other assets, valued first, sold openly and fully documented.",
    intro: [
      "When an asset has to be sold, whether by a lender, receiver, liquidator, executor or company, the process must be transparent and defensible. Our auctions are run by valuers, so every sale starts from an independent view of value and a reserve price grounded in evidence.",
      "We handle land and buildings, plant and machinery, vehicles, and office and household assets, from valuation, verification and lotting to publicity, bidder registration, the sale itself and the paperwork that follows. Sellers get an audit trail that stands up to scrutiny; buyers get a fair, open process.",
    ],
    included: [
      "Pre-sale valuation and reserve price advice",
      "Asset verification, cataloguing and lotting",
      "Publicity and public notices",
      "Bidder registration and checks",
      "Public auction or private treaty sale",
      "Sale documentation, receipts and auctioneer's report",
      "Coordination of payment, collection and handover",
    ],
    audience: [
      "Banks and lenders realising security",
      "Receivers, liquidators and asset recovery bodies",
      "Companies disposing of plant, fleet or stock",
      "Executors and families",
      "Government agencies disposing of assets",
      "Insurers disposing of salvage",
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const whyChooseUs = [
  {
    title: "Registered and accountable",
    body: "Every report is signed by an ESVARBON-registered Estate Surveyor & Valuer and carries their seal and stamp, so you always know who stands behind the figure.",
  },
  {
    title: "Independent by design",
    body: "We check for conflicts of interest before accepting any instruction and report the value the evidence supports, not the value anyone hopes for.",
  },
  {
    title: "Inspected, not estimated",
    body: "Our valuers physically inspect and measure the property before signing a value. Any desktop work is agreed in writing and stated in the report.",
  },
  {
    title: "Title reviewed, not assumed",
    body: "We examine the title documents behind every valuation and flag gaps such as missing Consent or uncharted surveys before they become your problem.",
  },
  {
    title: "Reports built for scrutiny",
    body: "Reports follow International and Nigerian Valuation Standards, setting out the basis of value, comparables, calculations and assumptions lenders and auditors look for.",
  },
  {
    title: "Clear fees, honest timelines",
    body: "You get a written fee and delivery date before work starts, and we tell you early if access or documents could affect either.",
  },
] as const;

export const valuationSteps = [
  {
    title: "Instruction",
    body: "Tell us about the property, why you need the valuation and who will rely on it. We confirm the right basis of value and, for lending, your lender's requirements.",
  },
  {
    title: "Document review & fee quote",
    body: "Send copies of your title and supporting documents. We flag any gaps and send an engagement letter with the scope, fee and delivery date.",
  },
  {
    title: "Inspection",
    body: "A valuer visits at an agreed time to inspect, measure and photograph the property, noting its condition, services, access and boundaries.",
  },
  {
    title: "Research & analysis",
    body: "We gather current sales, rental and cost evidence and apply the right method, reporting Market Value and Forced Sale Value where needed.",
  },
  {
    title: "Signed & sealed report",
    body: "You receive a full report signed by an ESVARBON-registered valuer with their seal and stamp, sent to you or directly to your lender.",
  },
] as const;

export const valuationPurposeDetails = [
  { title: "Mortgage & loan security", body: "Market Value and Forced Sale Value of collateral, in the format your lender expects." },
  { title: "Financial reporting", body: "Fair value of property and investment property for annual accounts (IFRS 13, IAS 16, IAS 40)." },
  { title: "Insurance & reinstatement", body: "What it would cost to rebuild, so you are neither underinsured nor overpaying." },
  { title: "Mergers & acquisitions", body: "Independent asset values to support pricing, due diligence and negotiation." },
  { title: "Compensation", body: "Claims where land is acquired or rights revoked, including unexhausted improvements." },
  { title: "Tax, probate & estates", body: "Defensible values for tax, estate inventories and fair distribution among beneficiaries." },
  { title: "Litigation & disputes", body: "Independent valuation evidence and expert reports for courts and arbitration." },
  { title: "Sale & purchase advice", body: "Know what to ask, what to offer and when to walk away." },
  { title: "Liquidation & forced sale", body: "Realistic values where a sale must happen within a limited marketing period." },
  { title: "Rent & lease review", body: "Market rent assessments for new lettings, reviews and renewals." },
] as const;

export const requiredDocuments = [
  "Title document: C of O, registered Deed of Assignment, Governor's Consent, Letter of Allocation, or excision/gazette details",
  "Registered survey plan, with charting details if available",
  "Approved building plan or planning permit",
  "Recent Land Use Charge or tenement rate receipts",
  "Tenancy schedule and leases, for let property",
  "Your lender's valuation instruction, for mortgage valuations",
  "Previous valuation reports or fixed asset register, for financial reporting",
  "Owner or company identification (CAC documents for companies)",
] as const;

export const faqs = [
  {
    q: "How much does a valuation cost?",
    a: "It depends on the purpose, property type, size, location and complexity. We quote in writing after reviewing your documents, and the fee is agreed in our engagement letter before any inspection takes place.",
  },
  {
    q: "How long does a valuation take?",
    a: "We confirm a delivery date in your quote. Single properties with complete documents move fastest; portfolios, plant and machinery and specialised property take longer. The most common causes of delay are site access and missing documents.",
  },
  {
    q: "Will my bank accept your report?",
    a: "Each lender decides which valuers it accepts, and many keep an approved panel. Tell us your lender when you instruct us and we will confirm acceptance before you pay anything.",
  },
  {
    q: "What is ESVARBON, and why does it matter?",
    a: "The Estate Surveyors and Valuers Registration Board of Nigeria is the statutory body that regulates the profession. Only registered practitioners may practise as Estate Surveyors and Valuers, and they issue a personal seal and security stamp for reports, so a sealed report tells you an accountable professional signed it.",
  },
  {
    q: "What is the difference between Market Value and Forced Sale Value?",
    a: "Market Value is the price a property should achieve between a willing buyer and seller after proper marketing. Forced Sale Value reflects a sale under pressure or a shortened marketing period, so it is usually lower. Lenders often ask for both.",
  },
  {
    q: "Do you work outside Lagos?",
    a: "Yes. Our office is in Victoria Island, Lagos, and we take instructions nationwide. Any travel costs are shown in your quote before you instruct us.",
  },
  {
    q: "Will you inspect the property?",
    a: "Yes. We inspect and measure a property before we sign a value for it. If a restricted or desktop valuation is appropriate, we agree that with you in writing and state it clearly in the report.",
  },
  {
    q: "Can you value land that has no C of O?",
    a: "Yes. We value the interest as it actually stands, whether Deed of Assignment, excision, gazette or awaiting regularisation, and state the title position clearly. If your lender needs perfected title, our Land Administration team can help you get it.",
  },
  {
    q: "Is my information kept confidential?",
    a: "Yes. Your report is addressed to you and any parties you name, such as your bank. We do not share your information or report without your consent, unless the law or our regulator requires it.",
  },
] as const;

export const clientSegments = [
  { title: "Banks & mortgage lenders", body: "Collateral valuations and forced sale values." },
  { title: "Corporates & auditors", body: "Fair value for financial statements." },
  { title: "Developers & investors", body: "Feasibility, viability and acquisitions." },
  { title: "Law firms & families", body: "Probate, disputes and estate administration." },
  { title: "Government & agencies", body: "Compensation and asset disposal." },
  { title: "Homeowners & diaspora", body: "Buying, selling and managing with confidence." },
] as const;

export const coreValues = [
  { title: "Integrity & transparency", body: "Trust is at the heart of every appraisal and transaction." },
  { title: "Professionalism & compliance", body: "We adhere strictly to NIESV, ESVARBON and IVS standards." },
  { title: "Local insight, global standards", body: "Deep Nigerian market knowledge with international best practice." },
  { title: "Results-driven", body: "We help you make property decisions that create measurable value." },
] as const;

export const mission =
  "To empower property owners, investors and developers with accurate, actionable and legally sound estate surveying, valuation and management solutions.";
export const vision =
  "To be a premier estate surveying and valuation firm in Nigeria, known for innovation, reliability and client-centred real estate solutions.";
