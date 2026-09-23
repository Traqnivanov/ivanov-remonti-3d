-- P2.2a + P2.2b — Persistence schema + security foundation DRAFT.
-- IMPORTANT: reviewed code only at this checkpoint.
-- Do not apply to Supabase until the complete migration review is accepted.

create table public.work_users (
  user_id uuid primary key references auth.users(id) on delete restrict,
  display_name text not null,
  role text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint work_users_display_name_not_blank
    check (length(btrim(display_name)) > 0),
  constraint work_users_role_not_blank
    check (length(btrim(role)) > 0)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner_user_id uuid not null references public.work_users(user_id) on delete restrict,
  status text not null default 'draft',
  schema_version integer not null,
  work_version bigint not null default 1,
  work_state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint projects_title_not_blank
    check (length(btrim(title)) > 0),
  constraint projects_status_valid
    check (status in ('draft', 'active', 'archived')),
  constraint projects_schema_version_positive
    check (schema_version > 0),
  constraint projects_work_version_positive
    check (work_version > 0),
  constraint projects_work_state_object
    check (jsonb_typeof(work_state) = 'object'),
  constraint projects_work_state_has_project_id
    check (
      work_state ? 'projectId'
      and jsonb_typeof(work_state -> 'projectId') = 'string'
      and work_state ->> 'projectId' = id::text
    ),
  constraint projects_work_state_schema_version_matches
    check (
      case
        when work_state ? 'schemaVersion'
          and jsonb_typeof(work_state -> 'schemaVersion') = 'number'
        then (work_state ->> 'schemaVersion')::numeric = schema_version
        else false
      end
    )
);

create index projects_owner_user_id_idx
  on public.projects (owner_user_id);

create index projects_owner_status_updated_idx
  on public.projects (owner_user_id, status, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger work_users_set_updated_at
before update on public.work_users
for each row
execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- Explicit privilege baseline
-- ---------------------------------------------------------------------------
-- The project was created with automatic exposure disabled, but we do not
-- trust ambient/default privileges. Current and future application tables
-- must be explicit-by-design.

revoke all on table public.work_users from public, anon, authenticated;
revoke all on table public.projects from public, anon, authenticated;

grant select on table public.work_users to authenticated;
grant select, insert, update on table public.projects to authenticated;

-- Protected server operations may use service_role later. It is never shipped
-- to the browser.
grant all on table public.work_users to service_role;
grant all on table public.projects to service_role;

-- Future objects created by postgres in public start private for browser roles.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

alter default privileges for role postgres in schema public
  grant all on tables to service_role;

alter default privileges for role postgres in schema public
  grant all on sequences to service_role;

alter default privileges for role postgres in schema public
  grant execute on functions to service_role;

-- Trigger helper is internal database plumbing, not a browser RPC.
revoke all on function public.set_updated_at() from public, anon, authenticated;
grant execute on function public.set_updated_at() to service_role;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.work_users enable row level security;
alter table public.projects enable row level security;

-- Work users can only see their own active allow-list row.
create policy work_users_select_self_active
on public.work_users
for select
to authenticated
using (
  user_id = (select auth.uid())
  and active = true
);

-- Projects are private to their owner, and the owner must still be an active
-- authorized Work user.

create policy projects_select_own
on public.projects
for select
to authenticated
using (
  owner_user_id = (select auth.uid())
  and exists (
    select 1
    from public.work_users as wu
    where wu.user_id = (select auth.uid())
      and wu.active = true
  )
);

create policy projects_insert_own
on public.projects
for insert
to authenticated
with check (
  owner_user_id = (select auth.uid())
  and exists (
    select 1
    from public.work_users as wu
    where wu.user_id = (select auth.uid())
      and wu.active = true
  )
);

create policy projects_update_own
on public.projects
for update
to authenticated
using (
  owner_user_id = (select auth.uid())
  and exists (
    select 1
    from public.work_users as wu
    where wu.user_id = (select auth.uid())
      and wu.active = true
  )
)
with check (
  owner_user_id = (select auth.uid())
  and exists (
    select 1
    from public.work_users as wu
    where wu.user_id = (select auth.uid())
      and wu.active = true
  )
);

-- No DELETE privilege or DELETE policy in Slice 2.
