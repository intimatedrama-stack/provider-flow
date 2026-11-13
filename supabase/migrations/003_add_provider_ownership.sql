-- Scope dashboard data to the authenticated provider.
alter table clients add column if not exists provider_id uuid references auth.users(id) on delete cascade;
alter table screening_submissions add column if not exists provider_id uuid references auth.users(id) on delete cascade;
alter table posts add column if not exists provider_id uuid references auth.users(id) on delete cascade;
alter table availability_schedule add column if not exists provider_id uuid references auth.users(id) on delete cascade;
alter table availability_overrides add column if not exists provider_id uuid references auth.users(id) on delete cascade;

create index if not exists clients_provider_id_idx on clients(provider_id);
create index if not exists screening_submissions_provider_id_idx on screening_submissions(provider_id);
create index if not exists posts_provider_id_idx on posts(provider_id);
create index if not exists availability_schedule_provider_id_idx on availability_schedule(provider_id);
create index if not exists availability_overrides_provider_id_idx on availability_overrides(provider_id);

drop policy if exists authenticated_select_clients on clients;
create policy authenticated_select_clients on clients
  for select to authenticated using (provider_id = auth.uid());
drop policy if exists authenticated_insert_clients on clients;
create policy authenticated_insert_clients on clients
  for insert to authenticated with check (provider_id = auth.uid());
drop policy if exists authenticated_update_clients on clients;
create policy authenticated_update_clients on clients
  for update to authenticated using (provider_id = auth.uid()) with check (provider_id = auth.uid());
drop policy if exists authenticated_select_screening_submissions on screening_submissions;
create policy authenticated_select_screening_submissions on screening_submissions
  for select to authenticated using (provider_id = auth.uid());
drop policy if exists authenticated_insert_screening_submissions on screening_submissions;
create policy authenticated_insert_screening_submissions on screening_submissions
  for insert to authenticated with check (provider_id = auth.uid());
drop policy if exists authenticated_update_screening_submissions on screening_submissions;
create policy authenticated_update_screening_submissions on screening_submissions
  for update to authenticated using (provider_id = auth.uid()) with check (provider_id = auth.uid());
drop policy if exists authenticated_select_posts on posts;
create policy authenticated_select_posts on posts
  for select to authenticated using (provider_id = auth.uid());
drop policy if exists authenticated_insert_posts on posts;
create policy authenticated_insert_posts on posts
  for insert to authenticated with check (provider_id = auth.uid());
drop policy if exists authenticated_update_posts on posts;
create policy authenticated_update_posts on posts
  for update to authenticated using (provider_id = auth.uid()) with check (provider_id = auth.uid());
drop policy if exists authenticated_delete_posts on posts;
create policy authenticated_delete_posts on posts
  for delete to authenticated using (provider_id = auth.uid());
drop policy if exists authenticated_insert_availability_schedule on availability_schedule;
create policy authenticated_insert_availability_schedule on availability_schedule
  for insert to authenticated with check (provider_id = auth.uid());
drop policy if exists authenticated_update_availability_schedule on availability_schedule;
create policy authenticated_update_availability_schedule on availability_schedule
  for update to authenticated using (provider_id = auth.uid()) with check (provider_id = auth.uid());
drop policy if exists authenticated_delete_availability_schedule on availability_schedule;
create policy authenticated_delete_availability_schedule on availability_schedule
  for delete to authenticated using (provider_id = auth.uid());
drop policy if exists authenticated_insert_availability_overrides on availability_overrides;
create policy authenticated_insert_availability_overrides on availability_overrides
  for insert to authenticated with check (provider_id = auth.uid());
drop policy if exists authenticated_update_availability_overrides on availability_overrides;
create policy authenticated_update_availability_overrides on availability_overrides
  for update to authenticated using (provider_id = auth.uid()) with check (provider_id = auth.uid());
drop policy if exists authenticated_delete_availability_overrides on availability_overrides;
create policy authenticated_delete_availability_overrides on availability_overrides
  for delete to authenticated using (provider_id = auth.uid());

-- Public intake rows must be routed to a provider by the caller.
drop policy if exists anon_insert_clients on clients;
create policy anon_insert_clients on clients
  for insert to anon with check (
    provider_id is not null
    and status = 'lead'
    and coalesce(revenue, 0) = 0
    and coalesce(repeat, false) = false
  );
drop policy if exists anon_insert_screening_submissions on screening_submissions;
create policy anon_insert_screening_submissions on screening_submissions
  for insert to anon with check (provider_id is not null and status = 'pending');
