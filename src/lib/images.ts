/**
 * Stock photography (Unsplash, free licence) used until Valueconnect's own
 * photos are uploaded through the admin. Property photos uploaded by admins
 * live in Supabase Storage instead.
 */
const u = (id: string) => `https://images.unsplash.com/${id}`;

export const img = {
  hero: [
    u("photo-1613490493576-7fde63acd811"),
    u("photo-1600596542815-ffad4c1539a9"),
    u("photo-1600585154340-be6161a56a0c"),
  ],
  houses: [
    u("photo-1600585154340-be6161a56a0c"),
    u("photo-1600596542815-ffad4c1539a9"),
    u("photo-1613490493576-7fde63acd811"),
    u("photo-1564013799919-ab600027ffc6"),
    u("photo-1568605114967-8130f3a36994"),
    u("photo-1580587771525-78b9dba3b914"),
    u("photo-1512917774080-9991f1c4c750"),
    u("photo-1570129477492-45c003edd2be"),
    u("photo-1600607687939-ce8a6c25118c"),
    u("photo-1605276374104-dee2a0ed3cd6"),
    u("photo-1583608205776-bfd35f0d9f83"),
    u("photo-1545324418-cc1a3fa10c00"),
  ],
  interiors: [
    u("photo-1600210492486-724fe5c67fb0"),
    u("photo-1600566753190-17f0baa2a6c3"),
    u("photo-1600607687644-c7171b42498b"),
    u("photo-1560448204-e02f11c3d0e2"),
    u("photo-1502672260266-1c1ef2d93688"),
    u("photo-1522708323590-d24dbb6b0267"),
  ],
  commercial: [
    u("photo-1486406146926-c627a92ad1ab"),
    u("photo-1497366216548-37526070297c"),
    u("photo-1497366811353-6870744d04b2"),
  ],
  land: [
    u("photo-1500382017468-9049fed747ef"),
    u("photo-1541888946425-d81bb19240f5"),
  ],
  people: [
    u("photo-1573497019940-1c28c88b4f3e"),
    u("photo-1560250097-0b93528c311a"),
    u("photo-1600880292203-757bb62b4baf"),
    u("photo-1556761175-5973dc0f32e7"),
    u("photo-1521791136064-7986c2920216"),
    u("photo-1573164713988-8665fc963095"),
  ],
  city: [u("photo-1618828665011-0abd973f7bb8")],
} as const;

export const serviceImages = {
  valuations: img.people[0],
  "property-facility-management": img.commercial[1],
  "estate-agency": img.people[4],
  "feasibility-viability-appraisal": img.people[2],
  "land-administration": img.land[0],
  auctioneering: img.people[3],
} as const;
