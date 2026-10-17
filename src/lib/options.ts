import type {
  ConsultationStatus,
  ListingType,
  MessageStatus,
  PropertyStatus,
  PropertyType,
  ValuationStatus,
} from "./types";

export const listingTypeLabels: Record<ListingType, string> = {
  sale: "For sale",
  rent: "For rent",
  shortlet: "Shortlet",
  lease: "For lease",
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  detached: "Detached house",
  "semi-detached": "Semi-detached",
  terrace: "Terrace",
  duplex: "Duplex",
  apartment: "Apartment",
  penthouse: "Penthouse",
  bungalow: "Bungalow",
  land: "Land",
  office: "Office space",
  commercial: "Commercial",
  warehouse: "Warehouse",
};

export const propertyStatusLabels: Record<PropertyStatus, string> = {
  available: "Available",
  under_offer: "Under offer",
  sold: "Sold",
  let: "Let",
};

export const titleDocuments = [
  "Certificate of Occupancy (C of O)",
  "Governor's Consent",
  "Deed of Assignment",
  "Registered Survey Plan",
  "Excision / Gazette",
  "Right of Occupancy (R of O)",
  "Contract of Sale",
  "Allocation Letter",
  "Not sure / Other",
] as const;

export const valuationPurposes = [
  { value: "mortgage", label: "Mortgage / loan security", hint: "For banks and mortgage lenders" },
  { value: "financial_reporting", label: "Financial reporting", hint: "IFRS 13 fair value, audits" },
  { value: "sale_purchase", label: "Sale or purchase advice", hint: "Know the right price" },
  { value: "insurance", label: "Insurance / reinstatement", hint: "Cost to rebuild" },
  { value: "rental", label: "Rental / lease review", hint: "Market rent assessment" },
  { value: "probate", label: "Probate & estate administration", hint: "Wills, inheritance, tax" },
  { value: "mergers", label: "Mergers & acquisitions", hint: "Due diligence, transfers" },
  { value: "compensation", label: "Compensation claims", hint: "Acquisition, right of way" },
  { value: "liquidation", label: "Asset liquidation / forced sale", hint: "Receivership, recovery" },
  { value: "litigation", label: "Litigation / dispute", hint: "Expert valuation evidence" },
  { value: "other", label: "Something else", hint: "Tell us in the notes" },
] as const;

export const valuationPurposeLabel = (value: string) =>
  valuationPurposes.find((p) => p.value === value)?.label ?? value;

export const valuationAssetTypes = [
  "Residential house",
  "Apartment / flat",
  "Bare land",
  "Commercial / office",
  "Retail / shopping",
  "Industrial / warehouse",
  "Hotel / hospitality",
  "Estate / portfolio",
  "Plant & machinery",
  "Other",
] as const;

export const clientTypes = [
  "Individual",
  "Company",
  "Bank / lender",
  "Law firm",
  "Government / agency",
  "Developer",
] as const;

export const valuationStatusMeta: Record<
  ValuationStatus,
  { label: string; tone: "aqua" | "navy" | "amber" | "violet" | "sky" | "green" | "slate"; client: string }
> = {
  new: { label: "New", tone: "aqua", client: "Request received" },
  reviewing: { label: "Reviewing", tone: "sky", client: "Our valuers are reviewing your request" },
  quoted: { label: "Quote sent", tone: "violet", client: "Your fee quote is ready" },
  scheduled: { label: "Inspection booked", tone: "amber", client: "Inspection scheduled" },
  in_progress: { label: "In progress", tone: "navy", client: "Valuation in progress" },
  completed: { label: "Completed", tone: "green", client: "Report delivered" },
  cancelled: { label: "Cancelled", tone: "slate", client: "Request closed" },
};

export const valuationFlow: ValuationStatus[] = [
  "new",
  "reviewing",
  "quoted",
  "scheduled",
  "in_progress",
  "completed",
];

export const consultationStatusMeta: Record<ConsultationStatus, { label: string; tone: "aqua" | "navy" | "green" | "slate" }> = {
  new: { label: "New", tone: "aqua" },
  confirmed: { label: "Confirmed", tone: "navy" },
  completed: { label: "Completed", tone: "green" },
  cancelled: { label: "Cancelled", tone: "slate" },
};

export const messageStatusMeta: Record<MessageStatus, { label: string; tone: "aqua" | "navy" | "green" | "slate" }> = {
  new: { label: "New", tone: "aqua" },
  read: { label: "Read", tone: "navy" },
  replied: { label: "Replied", tone: "green" },
  archived: { label: "Archived", tone: "slate" },
};

export const consultationModes = [
  { value: "in_person", label: "At our office" },
  { value: "phone", label: "Phone call" },
  { value: "video", label: "Video call" },
] as const;

export const consultationTimes = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "3:30 PM"] as const;

export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

/** Cities used for the "Where we operate" tabs and listing filters. */
export const featuredCities = [
  { city: "Lagos", state: "Lagos", areas: ["Ikoyi", "Victoria Island", "Lekki", "Ikeja GRA", "Ajah", "Magodo"] },
  { city: "Abuja", state: "FCT - Abuja", areas: ["Maitama", "Asokoro", "Wuse II", "Guzape", "Gwarinpa", "Katampe"] },
  { city: "Port Harcourt", state: "Rivers", areas: ["Old GRA", "New GRA", "Trans-Amadi", "Peter Odili Road"] },
  { city: "Ibadan", state: "Oyo", areas: ["Bodija", "Jericho", "Iyaganku"] },
  { city: "Enugu", state: "Enugu", areas: ["Independence Layout", "GRA", "Trans-Ekulu"] },
] as const;

export const propertyFeatures = [
  "Swimming pool", "24/7 power", "Inverter backup", "Borehole", "Fitted kitchen", "BQ (boys' quarters)",
  "CCTV", "Gated estate", "Security post", "Gym", "Elevator", "Rooftop terrace", "Serviced",
  "Smart home", "Water treatment", "Ample parking", "Cinema room", "Garden", "Waterfront", "Study",
] as const;
