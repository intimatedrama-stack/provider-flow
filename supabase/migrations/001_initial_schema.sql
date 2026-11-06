-- Clients
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  phone text,
  city text,
  source text,
  revenue numeric default 0,
  notes text,
  repeat boolean default false,
  status text default 'lead' check (status in ('lead','active','vetted','blocked')),
  last_contact date
);

-- Screening questions
create table if not exists screening_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  display_order integer not null,
  required boolean default true
);

-- Screening submissions
create table if not exists screening_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  client_id uuid references clients(id),
  answers jsonb not null default '{}',
  status text default 'pending' check (status in ('pending','approved','rejected'))
);

-- Posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  ad text not null,
  city text,
  views integer default 0,
  messages integer default 0
);

-- Availability schedule (weekly recurring)
create table if not exists availability_schedule (
  id uuid primary key default gen_random_uuid(),
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_available boolean default true
);

-- Availability overrides (specific dates)
create table if not exists availability_overrides (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  is_available boolean not null,
  note text
);

-- Seed default screening questions
insert into screening_questions (question, display_order, required) values
  ('What city are you located in?', 1, true),
  ('How did you find me?', 2, true),
  ('Have you seen a provider before?', 3, true),
  ('Please provide any references (handles/names)', 4, false),
  ('Anything else you would like me to know?', 5, false)
on conflict do nothing;
