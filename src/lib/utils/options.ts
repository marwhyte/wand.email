import { BusinessType } from '../database/types'

export interface BusinessTypeInfo {
  title: string
  description: string
}

export const businessTypeInfoMap: Record<BusinessType, BusinessTypeInfo> = {
  [BusinessType.ConsumerGoods]: {
    title: 'Consumer goods',
    description: 'Clothes, jewelry, beauty, electronics, gifts, vehicles, home & garden, etc.',
  },
  [BusinessType.IndustrialGoods]: {
    title: 'Industrial goods',
    description: 'Business equipment, machinery, parts, medical devices, materials, or other supplies.',
  },
  [BusinessType.FoodAndBeverage]: {
    title: 'Food & beverage',
    description: 'Food, beverage, alcohol, or tobacco products.',
  },
  [BusinessType.SupplementsAndPharmaceuticals]: {
    title: 'Supplements & pharmaceuticals',
    description: 'Prescription drugs, vitamins, dietary products, medication, or health supplements.',
  },
  [BusinessType.Restaurant]: {
    title: 'Restaurant',
    description: 'Restaurant, bar, coffee shop, brewery, wine vineyard, bakery, catering.',
  },
  [BusinessType.GeneralMerchandiseRetailer]: {
    title: 'General merchandise retailer',
    description: 'Groceries, department stores, mass merchandisers, marketplaces, or retail chains.',
  },
  [BusinessType.WellnessAndFitnessServices]: {
    title: 'Wellness & fitness services',
    description: 'Gym, fitness studio, spa, barber, sports club, exercise classes, hair, or nail salons.',
  },
  [BusinessType.HospitalityAndTravel]: {
    title: 'Hospitality & travel',
    description: 'Hotel, park, tourism, flights, short-term rentals, or other hospitality services.',
  },
  [BusinessType.EventsAndEntertainment]: {
    title: 'Events & entertainment',
    description: 'Venues, museums, parks, sports teams, artists, musicians, or performers.',
  },
  [BusinessType.OtherPersonalServices]: {
    title: 'Other personal services',
    description: 'Plumber, electrician, photographer, child care, cleaning, landscaping, planning, etc.',
  },
  [BusinessType.AgencyMarketingAndConsulting]: {
    title: 'Agency, marketing, & consulting',
    description: 'Agency or freelance consulting, marketing, creative, or technical services.',
  },
  [BusinessType.FinancialAndInsurance]: {
    title: 'Financial & insurance',
    description: 'Banking, insurance, accounting, financial planning, investment credit, or lending.',
  },
  [BusinessType.Healthcare]: {
    title: 'Healthcare',
    description: 'Physicians, dentists, nursing care, hospitals, veterinary, or other health services.',
  },
  [BusinessType.ProfessionalAndBusinessServices]: {
    title: 'Professional & business services',
    description: 'Architect, lawyer, engineering, recruiting, maintenance, business administration, etc.',
  },
  [BusinessType.MediaAndContent]: {
    title: 'Media & content',
    description: 'News, blog, podcast, newsletter, content creator, recipes, affiliate marketing.',
  },
  [BusinessType.RealEstateAndConstruction]: {
    title: 'Real estate & construction',
    description: 'Real estate agency, property manager, developer, construction, building, leasing.',
  },
  [BusinessType.SoftwareOrSaaS]: {
    title: 'Software or SaaS',
    description: 'Software as a service, cloud computing, or other software products.',
  },
  [BusinessType.Education]: {
    title: 'Education',
    description: 'Schools, universities, colleges, online courses, or other educational services.',
  },
  [BusinessType.NonProfit]: {
    title: 'Non-profit',
    description: 'Charity, foundation, advocacy group, or other non-profit organizations.',
  },
  [BusinessType.GovernmentAndPublicAdministration]: {
    title: 'Government and public administration',
    description: 'Government agencies, public services, or other administrative services.',
  },
  [BusinessType.TelecommunicationsAndUtilities]: {
    title: 'Telecommunications and utilities',
    description: 'Telecommunications, electricity, gas, water, or other utility services.',
  },
  [BusinessType.TransportationAndWarehousing]: {
    title: 'Transportation and warehousing',
    description: 'Trucking, logistics, shipping, airlines, railroads, or other transportation services.',
  },
  [BusinessType.AgricultureForestryFishingAndHunting]: {
    title: 'Agriculture, forestry, fishing, and hunting',
    description: 'Farming, ranching, forestry, fishing, or other agricultural services.',
  },
}

export function getBusinessTypeOptions(): { id: BusinessType; description: string; label: string }[] {
  return Object.entries(businessTypeInfoMap).map(([key, value]) => ({
    id: key as BusinessType,
    description: value.description,
    label: value.title,
  }))
}

export function getBusinessTypeInfo(type: BusinessType): BusinessTypeInfo {
  return businessTypeInfoMap[type]
}
