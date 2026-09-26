/**
 * Types de la base Supabase — maintenus à la main pour rester alignés sur
 * `supabase/migrations/*.sql`. Peuvent être régénérés avec :
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ApplicationStatusEnum =
  | 'pending'
  | 'under_review'
  | 'additional_information_required'
  | 'approved'
  | 'rejected'
  | 'completed';

export type AdminUserRow = {
  user_id: string;
  role: 'admin' | 'viewer';
  display_name: string | null;
  created_at: string;
}

export type LoanProductRow = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  icon: string;
  tagline: string;
  description: string;
  long_description: string;
  min_amount: number;
  max_amount: number;
  min_duration: number;
  max_duration: number;
  default_duration: number;
  interest_rate: number;
  rate_type: Json;
  fees: Json;
  penalty_configuration: Json;
  key_conditions: string[];
  use_cases: string[];
  required_documents: string[];
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type SimulatorSettingsRow = {
  id: number;
  rate_model: Json;
  fees: Json;
  penalty_configuration: Json;
  min_amount: number;
  max_amount: number;
  min_duration: number;
  max_duration: number;
  default_duration: number;
  allow_user_rate_override: boolean;
  updated_at: string;
}

export type LoanApplicationRow = {
  id: string;
  reference_number: string;
  submission_key: string;
  loan_product_id: string | null;
  loan_product_slug: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line: string;
  postal_code: string;
  city: string;
  country: string;
  profession: string;
  employment_status: string;
  monthly_income: number;
  requested_amount: number;
  desired_duration: number;
  purpose: string;
  status: ApplicationStatusEnum;
  internal_notes: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  consent_privacy_at: string;
  consent_terms_at: string;
  consent_processing_at: string;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatusHistoryRow = {
  id: number;
  application_id: string;
  from_status: ApplicationStatusEnum | null;
  to_status: ApplicationStatusEnum;
  changed_by: string | null;
  note: string | null;
  created_at: string;
}

export type ApplicationDocumentRow = {
  id: string;
  application_id: string;
  document_type: string;
  original_name: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  status: 'received' | 'validated' | 'rejected';
  created_at: string;
}

export type TestimonialRow = {
  id: string;
  name: string;
  content: string;
  loan_type: string;
  image_url: string | null;
  rating: number;
  location: string | null;
  published_on: string | null;
  consent_reference: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type PartnerRow = {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  verified: boolean;
  logo_rights_confirmed: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ContactMessageRow = {
  id: string;
  locale: string;
  first_name: string;
  last_name: string;
  profession: string;
  monthly_income: number;
  requested_amount: number;
  desired_duration: number;
  whatsapp: string;
  phone: string | null;
  email: string;
  purpose: string;
  other_info: string | null;
  status: 'new' | 'contacted' | 'closed';
  ip_hash: string | null;
  created_at: string;
};

type Insertable<Row, Optional extends keyof Row> = Omit<Row, Optional> & Partial<Pick<Row, Optional>>;

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admin_users: Table<AdminUserRow, Insertable<AdminUserRow, 'role' | 'display_name' | 'created_at'>>;
      loan_products: Table<
        LoanProductRow,
        Insertable<
          LoanProductRow,
          | 'id'
          | 'icon'
          | 'tagline'
          | 'description'
          | 'long_description'
          | 'rate_type'
          | 'fees'
          | 'penalty_configuration'
          | 'key_conditions'
          | 'use_cases'
          | 'required_documents'
          | 'active'
          | 'sort_order'
          | 'created_at'
          | 'updated_at'
        >
      >;
      simulator_settings: Table<SimulatorSettingsRow, Partial<SimulatorSettingsRow>>;
      loan_applications: Table<
        LoanApplicationRow,
        Insertable<
          LoanApplicationRow,
          | 'id'
          | 'loan_product_id'
          | 'status'
          | 'internal_notes'
          | 'ip_hash'
          | 'user_agent'
          | 'consent_privacy_at'
          | 'consent_terms_at'
          | 'consent_processing_at'
          | 'created_at'
          | 'updated_at'
        >
      >;
      application_status_history: Table<
        ApplicationStatusHistoryRow,
        Insertable<ApplicationStatusHistoryRow, 'id' | 'from_status' | 'changed_by' | 'note' | 'created_at'>
      >;
      application_documents: Table<
        ApplicationDocumentRow,
        Insertable<ApplicationDocumentRow, 'id' | 'status' | 'created_at'>
      >;
      testimonials: Table<
        TestimonialRow,
        Insertable<
          TestimonialRow,
          | 'id'
          | 'image_url'
          | 'rating'
          | 'location'
          | 'published_on'
          | 'consent_reference'
          | 'active'
          | 'sort_order'
          | 'created_at'
          | 'updated_at'
        >
      >;
      contact_messages: Table<
        ContactMessageRow,
        Insertable<ContactMessageRow, 'id' | 'locale' | 'phone' | 'other_info' | 'status' | 'ip_hash' | 'created_at'>
      >;
      partners: Table<
        PartnerRow,
        Insertable<
          PartnerRow,
          | 'id'
          | 'logo_url'
          | 'website'
          | 'verified'
          | 'logo_rights_confirmed'
          | 'active'
          | 'sort_order'
          | 'created_at'
          | 'updated_at'
        >
      >;
    };
    Views: {
      application_stats: {
        Row: { status: ApplicationStatusEnum; total: number; total_amount: number };
        Relationships: [];
      };
    };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      admin_role: { Args: Record<string, never>; Returns: string | null };
    };
    Enums: {
      application_status: ApplicationStatusEnum;
    };
    CompositeTypes: Record<string, never>;
  };
};
