-- ==============================================================================
-- ANYLINK PC BUILDER: DATABASE MIGRATION SCRIPT
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  preferred_currency text default 'BDT',
  theme text default 'dark',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create a profile record when a user registers in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, preferred_currency)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'preferred_currency', 'BDT')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Builds Table
create table if not exists public.builds (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null default 'Untitled Build',
  share_code text unique, -- 7-character short URL code
  is_public boolean default false not null,
  components jsonb not null default '{}'::jsonb,
  dynamic_slots jsonb not null default '[]'::jsonb,
  total_price numeric(12,2) default 0.00 not null,
  currency text default 'BDT' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for lightning fast lookups
create index if not exists idx_builds_user_id on public.builds(user_id);
create index if not exists idx_builds_share_code on public.builds(share_code);
create index if not exists idx_builds_updated_at on public.builds(updated_at desc);

-- 3. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.builds enable row level security;

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Builds Policies
create policy "Users can view their own builds"
  on public.builds for select
  using (auth.uid() = user_id);

create policy "Anyone can view public or shared builds"
  on public.builds for select
  using (is_public = true or share_code is not null);

create policy "Users can insert their own builds"
  on public.builds for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own builds"
  on public.builds for update
  using (auth.uid() = user_id);

create policy "Users can delete their own builds"
  on public.builds for delete
  using (auth.uid() = user_id);

