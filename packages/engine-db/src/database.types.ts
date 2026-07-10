import type { Block, SiteSettings } from "@swim-engine/engine-contracts";

/**
 * The database schema as TypeScript, used to make the Supabase client typed.
 *
 * The JSONB columns are typed using the shapes from engine-contracts so the
 * database layer and the content rules can never drift apart: `blocks` is an
 * array of validated blocks, and `social_links` matches the site settings.
 */

/** Social links are stored as JSONB; the shape mirrors engine-contracts. */
type SocialLinks = NonNullable<SiteSettings["socialLinks"]>;

export interface Database {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          meta_title: string | null;
          meta_description: string | null;
          blocks: Block[];
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          meta_title?: string | null;
          meta_description?: string | null;
          blocks?: Block[];
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          blocks?: Block[];
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: boolean;
          school_name: string;
          contact_email: string;
          contact_phone: string | null;
          booking_enabled: boolean;
          social_links: SocialLinks;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          school_name: string;
          contact_email: string;
          contact_phone?: string | null;
          booking_enabled?: boolean;
          social_links?: SocialLinks;
          updated_at?: string;
        };
        Update: {
          id?: boolean;
          school_name?: string;
          contact_email?: string;
          contact_phone?: string | null;
          booking_enabled?: boolean;
          social_links?: SocialLinks;
          updated_at?: string;
        };
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          storage_path: string;
          alt: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          storage_path: string;
          alt?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          storage_path?: string;
          alt?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
