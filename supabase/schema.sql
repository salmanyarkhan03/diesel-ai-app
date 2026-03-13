-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- OWNERS
-- ─────────────────────────────────────────
create table if not exists owners (
  id          uuid primary key default uuid_generate_v4(),
  email       text unique not null,
  name        text not null,
  phone       text,
  plan        text not null default 'starter' check (plan in ('starter','pro','enterprise')),
  created_at  timestamptz not null default now()
);

alter table owners enable row level security;

create policy "owners: select own row"
  on owners for select
  using (auth.uid() = id);

create policy "owners: update own row"
  on owners for update
  using (auth.uid() = id);

-- ─────────────────────────────────────────
-- LOCATIONS
-- ─────────────────────────────────────────
create table if not exists locations (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references owners(id) on delete cascade,
  name        text not null,
  address     text not null,
  status      text not null default 'active' check (status in ('active','inactive')),
  created_at  timestamptz not null default now()
);

alter table locations enable row level security;

create policy "locations: owner access"
  on locations for all
  using (
    owner_id = auth.uid()
  );

-- ─────────────────────────────────────────
-- REPORTS
-- ─────────────────────────────────────────
create table if not exists reports (
  id           uuid primary key default uuid_generate_v4(),
  location_id  uuid not null references locations(id) on delete cascade,
  date         date not null,
  raw_data     jsonb not null default '{}',
  created_at   timestamptz not null default now()
);

alter table reports enable row level security;

create policy "reports: owner access via location"
  on reports for all
  using (
    exists (
      select 1 from locations
      where locations.id = reports.location_id
        and locations.owner_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- INSIGHTS
-- ─────────────────────────────────────────
create table if not exists insights (
  id           uuid primary key default uuid_generate_v4(),
  location_id  uuid not null references locations(id) on delete cascade,
  report_id    uuid references reports(id) on delete set null,
  priority     text not null check (priority in ('HIGH','MEDIUM','LOW')),
  title        text not null,
  description  text not null,
  action_label text,
  action_url   text,
  created_at   timestamptz not null default now()
);

alter table insights enable row level security;

create policy "insights: owner access via location"
  on insights for all
  using (
    exists (
      select 1 from locations
      where locations.id = insights.location_id
        and locations.owner_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- ALERTS
-- ─────────────────────────────────────────
create table if not exists alerts (
  id           uuid primary key default uuid_generate_v4(),
  location_id  uuid not null references locations(id) on delete cascade,
  type         text not null check (type in ('price','inventory','competitor','system')),
  message      text not null,
  resolved     boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table alerts enable row level security;

create policy "alerts: owner access via location"
  on alerts for all
  using (
    exists (
      select 1 from locations
      where locations.id = alerts.location_id
        and locations.owner_id = auth.uid()
    )
  );
