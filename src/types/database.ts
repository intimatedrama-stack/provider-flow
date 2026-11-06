export type ClientStatus = "lead" | "active" | "vetted" | "blocked";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Client {
  id: string;
  created_at: string;
  name: string;
  phone: string | null;
  city: string | null;
  source: string | null;
  revenue: number;
  notes: string | null;
  repeat: boolean;
  status: ClientStatus;
  last_contact: string | null;
}

export interface ScreeningQuestion {
  id: string;
  question: string;
  display_order: number;
  required: boolean;
}

export interface ScreeningSubmission {
  id: string;
  created_at: string;
  client_id: string | null;
  answers: Record<string, string>;
  status: SubmissionStatus;
  clients?: Client;
}

export interface Post {
  id: string;
  created_at: string;
  ad: string;
  city: string | null;
  views: number;
  messages: number;
}

export interface AvailabilitySchedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface AvailabilityOverride {
  id: string;
  date: string;
  is_available: boolean;
  note: string | null;
}

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: Client;
        Insert: Omit<Client, "id" | "created_at">;
        Update: Partial<Client>;
        Relationships: [];
      };
      screening_questions: {
        Row: ScreeningQuestion;
        Insert: Omit<ScreeningQuestion, "id">;
        Update: Partial<ScreeningQuestion>;
        Relationships: [];
      };
      screening_submissions: {
        Row: ScreeningSubmission;
        Insert: Omit<ScreeningSubmission, "id" | "created_at">;
        Update: Partial<ScreeningSubmission>;
        Relationships: [];
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, "id" | "created_at">;
        Update: Partial<Post>;
        Relationships: [];
      };
      availability_schedule: {
        Row: AvailabilitySchedule;
        Insert: Omit<AvailabilitySchedule, "id">;
        Update: Partial<AvailabilitySchedule>;
        Relationships: [];
      };
      availability_overrides: {
        Row: AvailabilityOverride;
        Insert: Omit<AvailabilityOverride, "id">;
        Update: Partial<AvailabilityOverride>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
