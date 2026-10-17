import type {
  Consultation,
  InboxMessage,
  Property,
  RequestEvent,
  ValuationRequest,
} from "../types";

/* Rows come back from Supabase in snake_case; the app uses camelCase. */
type Row = Record<string, unknown>;

const s = (v: unknown) => (v == null ? null : String(v));
const n = (v: unknown) => (v == null || v === "" ? null : Number(v));

export function mapProperty(r: Row): Property {
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title),
    listingType: r.listing_type as Property["listingType"],
    propertyType: r.property_type as Property["propertyType"],
    status: r.status as Property["status"],
    price: Number(r.price ?? 0),
    pricePeriod: (r.price_period ?? null) as Property["pricePeriod"],
    priceOnRequest: Boolean(r.price_on_request),
    state: String(r.state ?? ""),
    city: String(r.city ?? ""),
    area: String(r.area ?? ""),
    address: String(r.address ?? ""),
    bedrooms: n(r.bedrooms),
    bathrooms: n(r.bathrooms),
    toilets: n(r.toilets),
    parking: n(r.parking),
    sizeSqm: n(r.size_sqm),
    titleDocument: s(r.title_document),
    description: String(r.description ?? ""),
    features: (r.features as string[]) ?? [],
    images: (r.images as string[]) ?? [],
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    verified: Boolean(r.verified),
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at),
  };
}

export function propertyToRow(p: Omit<Property, "id" | "createdAt" | "updatedAt">) {
  return {
    slug: p.slug,
    title: p.title,
    listing_type: p.listingType,
    property_type: p.propertyType,
    status: p.status,
    price: p.price,
    price_period: p.pricePeriod,
    price_on_request: p.priceOnRequest,
    state: p.state,
    city: p.city,
    area: p.area,
    address: p.address,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    toilets: p.toilets,
    parking: p.parking,
    size_sqm: p.sizeSqm,
    title_document: p.titleDocument,
    description: p.description,
    features: p.features,
    images: p.images,
    featured: p.featured,
    published: p.published,
    verified: p.verified,
  };
}

export function mapValuationRequest(r: Row): ValuationRequest {
  return {
    id: String(r.id),
    reference: String(r.reference),
    status: r.status as ValuationRequest["status"],
    fullName: String(r.full_name),
    email: String(r.email),
    phone: String(r.phone),
    company: s(r.company),
    clientType: s(r.client_type),
    propertyType: String(r.property_type),
    purpose: String(r.purpose),
    state: String(r.state),
    city: s(r.city),
    address: String(r.address),
    landSize: s(r.land_size),
    buildingDetails: s(r.building_details),
    titleDocument: s(r.title_document),
    propertyId: s(r.property_id),
    preferredDate: s(r.preferred_date),
    urgency: (r.urgency as ValuationRequest["urgency"]) ?? "standard",
    contactMethod: s(r.contact_method),
    notes: s(r.notes),
    quoteAmount: n(r.quote_amount),
    inspectionDate: s(r.inspection_date),
    adminResponse: s(r.admin_response),
    internalNotes: s(r.internal_notes),
    respondedAt: s(r.responded_at),
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at),
  };
}

export function mapRequestEvent(r: Row): RequestEvent {
  return {
    id: String(r.id),
    requestId: String(r.request_id),
    kind: r.kind as RequestEvent["kind"],
    status: (r.status ?? null) as RequestEvent["status"],
    message: s(r.message),
    visibleToClient: Boolean(r.visible_to_client),
    actor: s(r.actor),
    createdAt: String(r.created_at),
  };
}

export function mapConsultation(r: Row): Consultation {
  return {
    id: String(r.id),
    reference: String(r.reference),
    status: r.status as Consultation["status"],
    fullName: String(r.full_name),
    email: String(r.email),
    phone: String(r.phone),
    service: String(r.service),
    mode: r.mode as Consultation["mode"],
    preferredDate: s(r.preferred_date),
    preferredTime: s(r.preferred_time),
    message: s(r.message),
    adminNotes: s(r.admin_notes),
    createdAt: String(r.created_at),
  };
}

export function mapMessage(r: Row): InboxMessage {
  const prop = r.properties as { title?: string } | null | undefined;
  return {
    id: String(r.id),
    kind: r.kind as InboxMessage["kind"],
    status: r.status as InboxMessage["status"],
    fullName: String(r.full_name),
    email: String(r.email),
    phone: s(r.phone),
    subject: s(r.subject),
    message: String(r.message),
    propertyId: s(r.property_id),
    propertyTitle: prop?.title ?? null,
    createdAt: String(r.created_at),
  };
}
