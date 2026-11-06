-- Enable Row Level Security and define explicit table access policies.

alter table clients enable row level security;
alter table screening_questions enable row level security;
alter table screening_submissions enable row level security;
alter table posts enable row level security;
alter table availability_schedule enable row level security;
alter table availability_overrides enable row level security;

-- Public read for intake and availability pages.
drop policy if exists public_read_screening_questions on screening_questions;
create policy public_read_screening_questions
  on screening_questions
  for select
  to anon, authenticated
  using (true);

drop policy if exists public_read_availability_schedule on availability_schedule;
create policy public_read_availability_schedule
  on availability_schedule
  for select
  to anon, authenticated
  using (true);

drop policy if exists public_read_availability_overrides on availability_overrides;
create policy public_read_availability_overrides
  on availability_overrides
  for select
  to anon, authenticated
  using (true);

-- Allow public intake submissions from the landing page.
drop policy if exists anon_insert_clients on clients;
create policy anon_insert_clients
  on clients
  for insert
  to anon
  with check (
    status = 'lead'
    and coalesce(revenue, 0) = 0
    and coalesce(repeat, false) = false
  );

drop policy if exists anon_insert_screening_submissions on screening_submissions;
create policy anon_insert_screening_submissions
  on screening_submissions
  for insert
  to anon
  with check (status = 'pending');

-- Authenticated dashboard access.
drop policy if exists authenticated_select_clients on clients;
create policy authenticated_select_clients
  on clients
  for select
  to authenticated
  using (true);

drop policy if exists authenticated_insert_clients on clients;
create policy authenticated_insert_clients
  on clients
  for insert
  to authenticated
  with check (true);

drop policy if exists authenticated_update_clients on clients;
create policy authenticated_update_clients
  on clients
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists authenticated_select_screening_submissions on screening_submissions;
create policy authenticated_select_screening_submissions
  on screening_submissions
  for select
  to authenticated
  using (true);

drop policy if exists authenticated_insert_screening_submissions on screening_submissions;
create policy authenticated_insert_screening_submissions
  on screening_submissions
  for insert
  to authenticated
  with check (true);

drop policy if exists authenticated_update_screening_submissions on screening_submissions;
create policy authenticated_update_screening_submissions
  on screening_submissions
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists authenticated_select_posts on posts;
create policy authenticated_select_posts
  on posts
  for select
  to authenticated
  using (true);

drop policy if exists authenticated_insert_posts on posts;
create policy authenticated_insert_posts
  on posts
  for insert
  to authenticated
  with check (true);

drop policy if exists authenticated_update_posts on posts;
create policy authenticated_update_posts
  on posts
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists authenticated_delete_posts on posts;
create policy authenticated_delete_posts
  on posts
  for delete
  to authenticated
  using (true);

drop policy if exists authenticated_insert_availability_schedule on availability_schedule;
create policy authenticated_insert_availability_schedule
  on availability_schedule
  for insert
  to authenticated
  with check (true);

drop policy if exists authenticated_update_availability_schedule on availability_schedule;
create policy authenticated_update_availability_schedule
  on availability_schedule
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists authenticated_delete_availability_schedule on availability_schedule;
create policy authenticated_delete_availability_schedule
  on availability_schedule
  for delete
  to authenticated
  using (true);

drop policy if exists authenticated_insert_availability_overrides on availability_overrides;
create policy authenticated_insert_availability_overrides
  on availability_overrides
  for insert
  to authenticated
  with check (true);

drop policy if exists authenticated_update_availability_overrides on availability_overrides;
create policy authenticated_update_availability_overrides
  on availability_overrides
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists authenticated_delete_availability_overrides on availability_overrides;
create policy authenticated_delete_availability_overrides
  on availability_overrides
  for delete
  to authenticated
  using (true);
