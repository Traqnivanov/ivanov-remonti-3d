-- P2.2a — Persistence schema foundation DRAFT.
-- IMPORTANT: this file is reviewed code only at this checkpoint.
-- Do not apply to Supabase until P2.2b security review is complete.
--
-- Security (RLS / grants / policies) is intentionally added in P2.2b
-- before this migration is allowed to run.

create table public.work_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
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
