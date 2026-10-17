export type ListingType = "sale" | "rent" | "shortlet" | "lease";

export type PropertyType =
  | "detached"
  | "semi-detached"
  | "terrace"
  | "duplex"
  | "apartment"
  | "penthouse"
  | "bungalow"
  | "land"
  | "office"
  | "commercial"
  | "warehouse";

export type PropertyStatus = "available" | "under_offer" | "sold" | "let";

export type PricePeriod = "year" | "month" | "night" | null;

export interface Property {
  id: string;
  slug: string;
  title: string;
  listingType: ListingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  /** Whole naira. */
  price: number;
  pricePeriod: PricePeriod;
  priceOnRequest: boolean;
  state: string;
  city: string;
  area: string;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  toilets: number | null;
  parking: number | null;
  sizeSqm: number | null;
  titleDocument: string | null;
  description: string;
  features: string[];
  images: string[];
  featured: boolean;
  published: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ValuationStatus =
  | "new"
  | "reviewing"
  | "quoted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ValuationRequest {
  id: string;
  reference: string;
  status: ValuationStatus;
  fullName: string;
  email: string;
  phone: string;
  company: string | null;
  clientType: string | null;
  propertyType: string;
  purpose: string;
  state: string;
  city: string | null;
  address: string;
  landSize: string | null;
  buildingDetails: string | null;
  titleDocument: string | null;
  propertyId: string | null;
  preferredDate: string | null;
  urgency: "standard" | "express";
  contactMethod: string | null;
  notes: string | null;
  quoteAmount: number | null;
  inspectionDate: string | null;
  adminResponse: string | null;
  internalNotes: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RequestEvent {
  id: string;
  requestId: string;
  kind: "created" | "status" | "response" | "note";
  status: ValuationStatus | null;
  message: string | null;
  visibleToClient: boolean;
  actor: string | null;
  createdAt: string;
}

export type ConsultationStatus = "new" | "confirmed" | "completed" | "cancelled";

export interface Consultation {
  id: string;
  reference: string;
  status: ConsultationStatus;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  mode: "in_person" | "phone" | "video";
  preferredDate: string | null;
  preferredTime: string | null;
  message: string | null;
  adminNotes: string | null;
  createdAt: string;
}

export type MessageStatus = "new" | "read" | "replied" | "archived";

export interface InboxMessage {
  id: string;
  kind: "contact" | "enquiry";
  status: MessageStatus;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  propertyId: string | null;
  propertyTitle: string | null;
  createdAt: string;
}

export interface Subscriber {
  email: string;
  createdAt: string;
}

/** Standard result shape for every Server Action that backs a form. */
export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string; preview?: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** What a client sees on the Track page; never includes internal notes. */
export interface TrackedRequest {
  reference: string;
  status: ValuationStatus;
  firstName: string;
  propertyType: string;
  purpose: string;
  address: string;
  state: string;
  urgency: "standard" | "express";
  quoteAmount: number | null;
  inspectionDate: string | null;
  adminResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  events: { kind: string; status: string | null; message: string | null; createdAt: string }[];
}
