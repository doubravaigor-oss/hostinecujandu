-- Administrace Hostince U Jandů
-- Tabulky pro jídelní lístek, fotky, akce a otevírací dobu, práva, pravidla,
-- automatické přiřazení práva pro vybrané e-maily a první naplnění datem,
-- které bylo dosud napsané přímo v src/data/hostinec.ts.

-- ================= ROLE =================
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- ================= E-MAILY, KTERÉ DOSTANOU PRÁVO EDITOVAT =================
create table public.admin_whitelist (
  email text primary key,
  poznamka text not null default ''
);

grant all on public.admin_whitelist to service_role;

alter table public.admin_whitelist enable row level security;

create policy "admin_whitelist_admins_all" on public.admin_whitelist
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.admin_whitelist (email, poznamka) values
  ('doubrava.igor@gmail.com', 'Igor Doubrava - majitel');

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if exists (select 1 from public.admin_whitelist w where lower(w.email) = lower(new.email)) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
      on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ================= OBSAH WEBU =================
create table public.menu_kategorie (
  id uuid primary key default gen_random_uuid(),
  nazev text not null,
  poradi int not null default 0
);

create table public.menu_polozky (
  id uuid primary key default gen_random_uuid(),
  kategorie_id uuid not null references public.menu_kategorie(id) on delete cascade,
  nazev text not null,
  cena text not null,
  popis text not null default '',
  poradi int not null default 0
);

create table public.fotky (
  id uuid primary key default gen_random_uuid(),
  popis text not null default '',
  poradi int not null default 0,
  asset_url text,
  storage_path text,
  created_at timestamptz not null default now()
);

create table public.akce (
  id uuid primary key default gen_random_uuid(),
  datum text not null default '',
  nadpis text not null,
  text text not null default '',
  nove boolean not null default false,
  poradi int not null default 0,
  foto_id uuid references public.fotky(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.pravidelne_akce (
  id uuid primary key default gen_random_uuid(),
  nazev text not null,
  text text not null default '',
  poradi int not null default 0
);

create table public.hodiny (
  id uuid primary key default gen_random_uuid(),
  den text not null,
  cas text not null,
  poradi int not null default 0
);

create table public.hodiny_zmeny (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  platnost text not null default '',
  created_at timestamptz not null default now()
);

create table public.nastaveni (
  klic text primary key,
  hodnota text not null
);

-- ================= PRÁVA =================
grant select on public.menu_kategorie to anon, authenticated;
grant insert, update, delete on public.menu_kategorie to authenticated;
grant all on public.menu_kategorie to service_role;

grant select on public.menu_polozky to anon, authenticated;
grant insert, update, delete on public.menu_polozky to authenticated;
grant all on public.menu_polozky to service_role;

grant select on public.fotky to anon, authenticated;
grant insert, update, delete on public.fotky to authenticated;
grant all on public.fotky to service_role;

grant select on public.akce to anon, authenticated;
grant insert, update, delete on public.akce to authenticated;
grant all on public.akce to service_role;

grant select on public.pravidelne_akce to anon, authenticated;
grant insert, update, delete on public.pravidelne_akce to authenticated;
grant all on public.pravidelne_akce to service_role;

grant select on public.hodiny to anon, authenticated;
grant insert, update, delete on public.hodiny to authenticated;
grant all on public.hodiny to service_role;

grant select on public.hodiny_zmeny to anon, authenticated;
grant insert, update, delete on public.hodiny_zmeny to authenticated;
grant all on public.hodiny_zmeny to service_role;

grant select on public.nastaveni to anon, authenticated;
grant insert, update, delete on public.nastaveni to authenticated;
grant all on public.nastaveni to service_role;

-- ================= PRAVIDLA (RLS) =================
alter table public.menu_kategorie enable row level security;
create policy "menu_kategorie_read" on public.menu_kategorie for select to anon, authenticated using (true);
create policy "menu_kategorie_insert" on public.menu_kategorie for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "menu_kategorie_update" on public.menu_kategorie for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "menu_kategorie_delete" on public.menu_kategorie for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

alter table public.menu_polozky enable row level security;
create policy "menu_polozky_read" on public.menu_polozky for select to anon, authenticated using (true);
create policy "menu_polozky_insert" on public.menu_polozky for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "menu_polozky_update" on public.menu_polozky for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "menu_polozky_delete" on public.menu_polozky for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

alter table public.fotky enable row level security;
create policy "fotky_read" on public.fotky for select to anon, authenticated using (true);
create policy "fotky_insert" on public.fotky for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "fotky_update" on public.fotky for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "fotky_delete" on public.fotky for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

alter table public.akce enable row level security;
create policy "akce_read" on public.akce for select to anon, authenticated using (true);
create policy "akce_insert" on public.akce for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "akce_update" on public.akce for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "akce_delete" on public.akce for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

alter table public.pravidelne_akce enable row level security;
create policy "pravidelne_akce_read" on public.pravidelne_akce for select to anon, authenticated using (true);
create policy "pravidelne_akce_insert" on public.pravidelne_akce for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "pravidelne_akce_update" on public.pravidelne_akce for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "pravidelne_akce_delete" on public.pravidelne_akce for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

alter table public.hodiny enable row level security;
create policy "hodiny_read" on public.hodiny for select to anon, authenticated using (true);
create policy "hodiny_insert" on public.hodiny for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "hodiny_update" on public.hodiny for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "hodiny_delete" on public.hodiny for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

alter table public.hodiny_zmeny enable row level security;
create policy "hodiny_zmeny_read" on public.hodiny_zmeny for select to anon, authenticated using (true);
create policy "hodiny_zmeny_insert" on public.hodiny_zmeny for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "hodiny_zmeny_update" on public.hodiny_zmeny for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "hodiny_zmeny_delete" on public.hodiny_zmeny for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

alter table public.nastaveni enable row level security;
create policy "nastaveni_read" on public.nastaveni for select to anon, authenticated using (true);
create policy "nastaveni_insert" on public.nastaveni for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "nastaveni_update" on public.nastaveni for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "nastaveni_delete" on public.nastaveni for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ================= ÚLOŽIŠTĚ FOTEK =================
create policy "fotky_storage_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotky' and public.has_role(auth.uid(), 'admin'));
create policy "fotky_storage_select" on storage.objects for select to authenticated
  using (bucket_id = 'fotky' and public.has_role(auth.uid(), 'admin'));
create policy "fotky_storage_update" on storage.objects for update to authenticated
  using (bucket_id = 'fotky' and public.has_role(auth.uid(), 'admin'));
create policy "fotky_storage_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'fotky' and public.has_role(auth.uid(), 'admin'));

-- ================= NAPLNĚNÍ SOUCASNÝMI ÚDAJI =================
insert into public.menu_kategorie (nazev, poradi) values
  ('K jídlu', 10),
  ('Drobné pochutiny', 20),
  ('Čepované pivo', 30),
  ('Nealko nápoje', 40),
  ('Víno a cidery', 50),
  ('Teplé nápoje', 60),
  ('Destiláty (4 cl / 2 cl)', 70),
  ('Míchané nápoje (0,3 l)', 80);

insert into public.menu_polozky (kategorie_id, nazev, cena, popis, poradi)
select k.id, v.nazev, v.cena, v.popis, v.poradi
from (values
  ('K jídlu', 'Petrovický utopenec s chlebem', '75 Kč', '★ Legenda k pivu! Pikantní buřt plněný okurkou, paprikou a feferonkou, naložený s cibulí v octovém nálevu. Pro ty, co mají rádi pořádně od plic.', 10),
  ('K jídlu', 'Vinárníkovy tousty', '85 Kč', '★ Receptura od vinárníka Mirka až z pražských Kobylis. Toust bohatě naplněný – tři omáčky, beraní rohy a nic se tu nešetří.', 20),
  ('K jídlu', 'Nakládaný hermelín', '90 Kč', '★ Česká hospodská klasika. Naložený hermelín – s chlebem a vychlazeným pivem nemá konkurenci.', 30),
  ('K jídlu', 'Ďábelská topinka', '90 Kč', '★ Vaříme jen občas, když ji máme. Nálož masa na smaženém chlebu, sypaná goudou, k tomu kyselá zelenina – čirá radost.', 40),
  ('K jídlu', 'Pizza della casa', '165 Kč', '★ Pizza od pražské rodinné firmy Pizza Della Casa – tradiční italská receptura a kvalitní suroviny. Rovnou k pivu.', 50),
  ('K jídlu', 'Táboráček', '50 Kč', '', 60),
  ('Drobné pochutiny', 'Chipsy (Lays, různé příchutě)', '38 Kč', '', 10),
  ('Drobné pochutiny', 'Oříšky', '38 Kč', '', 20),
  ('Drobné pochutiny', 'Tyčinky pekařské solené', '38 Kč', '', 30),
  ('Drobné pochutiny', 'U nás pražené červené arašídy, solené', '45 Kč', '', 40),
  ('Čepované pivo', 'Radegast 10° – 0,5 l', '41 Kč', '', 10),
  ('Čepované pivo', 'Radegast 10° – 0,3 l', '28 Kč', '', 20),
  ('Čepované pivo', 'Plzeň 12° – 0,5 l', '54 Kč', '', 30),
  ('Čepované pivo', 'Plzeň 12° – 0,3 l', '37 Kč', '', 40),
  ('Čepované pivo', 'Nealkoholické pivo (dle nabídky) – 0,5 l', '40 Kč', '', 50),
  ('Nealko nápoje', 'Limonáda ZON, různé příchutě – 0,33 l sklo', '29 Kč', '', 10),
  ('Nealko nápoje', 'Tonic ZON – 0,33 l', '29 Kč', '', 20),
  ('Nealko nápoje', 'Jemně perlivá voda ZON – 0,33 l', '24 Kč', '', 30),
  ('Nealko nápoje', 'Malina Johannes Limo – 0,33 l', '54 Kč', '', 40),
  ('Nealko nápoje', 'Matcha Johannes Limo – 0,33 l', '54 Kč', '', 50),
  ('Nealko nápoje', 'Coca-Cola – 0,3 l', '35 Kč', '', 60),
  ('Nealko nápoje', 'Pomerančový džus – 0,3 l', '39 Kč', '', 70),
  ('Nealko nápoje', 'Jablečný džus – 0,3 l', '39 Kč', '', 80),
  ('Nealko nápoje', 'Minerální voda Il Sano (citron, pomeranč, speciál) – 0,5 l', '30 Kč', '', 90),
  ('Víno a cidery', 'Víno bílé a červené dle aktuální nabídky – 2 dcl', '60 Kč', '', 10),
  ('Víno a cidery', 'Prosecco', '60 Kč', '', 20),
  ('Víno a cidery', 'Svařené víno', '50 Kč', '', 30),
  ('Víno a cidery', 'Johannes Cyder Extra Brut – 0,33 l', '62 Kč', '', 40),
  ('Víno a cidery', 'Johannes Cyder Demi Sec – 0,33 l', '62 Kč', '', 50),
  ('Teplé nápoje', 'Turek', '26 Kč', '', 10),
  ('Teplé nápoje', 'Espresso', '40 Kč', '', 20),
  ('Teplé nápoje', 'Doppio', '50 Kč', '', 30),
  ('Teplé nápoje', 'Cappuccino', '45 Kč', '', 40),
  ('Teplé nápoje', 'Latte', '50 Kč', '', 50),
  ('Teplé nápoje', 'Čaj (různé druhy)', '40 Kč', '', 60),
  ('Teplé nápoje', 'Grog', '45 Kč', '', 70),
  ('Teplé nápoje', 'Punč', '55 Kč', '', 80),
  ('Teplé nápoje', 'Horké mléko – 0,3 l', '30 Kč', '', 90),
  ('Destiláty (4 cl / 2 cl)', 'Finlandia', '50 / 26 Kč', '', 10),
  ('Destiláty (4 cl / 2 cl)', 'Elixír z bezového květu', '40 / 21 Kč', '', 20),
  ('Destiláty (4 cl / 2 cl)', 'Tuzemák', '35 / 19 Kč', '', 30),
  ('Destiláty (4 cl / 2 cl)', 'Fernet', '45 / 23 Kč', '', 40),
  ('Destiláty (4 cl / 2 cl)', 'Becherovka', '45 / 23 Kč', '', 50),
  ('Destiláty (4 cl / 2 cl)', 'Griotka', '35 / 19 Kč', '', 60),
  ('Destiláty (4 cl / 2 cl)', 'Moravská švestka bílá', '50 / 26 Kč', '', 70),
  ('Destiláty (4 cl / 2 cl)', 'Jägermeister', '60 / 32 Kč', '', 80),
  ('Destiláty (4 cl / 2 cl)', 'Baileys', '75 / 39 Kč', '', 90),
  ('Destiláty (4 cl / 2 cl)', 'Beefeater', '60 / 31 Kč', '', 100),
  ('Destiláty (4 cl / 2 cl)', 'Zelená', '35 / 19 Kč', '', 110),
  ('Destiláty (4 cl / 2 cl)', 'Bezový likér z květu', '39 / 21 Kč', '', 120),
  ('Destiláty (4 cl / 2 cl)', 'Jack Daniel''s Honey', '69 / 37 Kč', '', 130),
  ('Destiláty (4 cl / 2 cl)', 'Tullamore Dew', '63 / 32 Kč', '', 140),
  ('Míchané nápoje (0,3 l)', 'Tuzemák & Cola', '65 Kč', '', 10),
  ('Míchané nápoje (0,3 l)', 'Becherovka & Tonic', '70 Kč', '', 20),
  ('Míchané nápoje (0,3 l)', 'Gin & Tonic', '84 Kč', '', 30),
  ('Míchané nápoje (0,3 l)', 'Finlandia & pomerančový džus', '79 Kč', '', 40)
) as v(kat, nazev, cena, popis, poradi)
join public.menu_kategorie k on k.nazev = v.kat;

insert into public.fotky (asset_url, popis, poradi) values
  ('/__l5e/assets-v1/9424fd7d-d10f-4e5c-8380-4732800effe4/rizek.jpg', 'Řízky s bramborovým salátem', 10),
  ('/__l5e/assets-v1/6048973d-8b1a-4757-9728-4ce024491bd7/foto4.jpg', 'Velký sál připravený na hostinu', 20),
  ('/__l5e/assets-v1/0b11439b-4bff-466d-9a39-d9a0f728abd6/foto7.jpg', 'Hostinec prostřený pro hosty', 30),
  ('/__l5e/assets-v1/3c55b049-3ba0-4b10-9064-22ea53afd8d2/foto5.jpg', 'Snídaně / brunch hotelového typu', 40),
  ('/__l5e/assets-v1/e460a081-2b09-4f69-afc9-8640fac54fb9/foto2.jpg', 'Studené mísy na raut', 50),
  ('/__l5e/assets-v1/5bd8dfda-9bad-434d-a697-ff0d42e48fe1/foto8.jpg', 'Řízky a salát na raut', 60),
  ('/__l5e/assets-v1/a6015b2e-5fff-429f-8a35-6af6e3044515/foto3.jpg', 'Obložené chlebíčky', 70),
  ('/__l5e/assets-v1/11d345f3-dc6f-4d0d-90fb-13240ed42c2e/foto9.jpg', 'Snídaně s proseccem', 80),
  ('/__l5e/assets-v1/2de0da7a-dcaf-4eda-a8cb-214f7e92c6bd/foto1.jpg', 'Uzené, klobása, knedlík a zelí', 90),
  ('/__l5e/assets-v1/1a71a5a7-9271-4b6b-8b76-29a5ac2da97f/foto10.jpg', 'Ďábelská topinka', 100),
  ('/__l5e/assets-v1/df7f86ca-4129-4c32-bf49-053019a6c2a6/foto6.jpg', 'Prostřený stůl', 110);

insert into public.akce (datum, nadpis, text, nove, poradi) values
  ('', 'Nový web hostince je spuštěn!', 'Vítejte na našich nových stránkách. Najdete zde jídelní i nápojový lístek, fotky a informace o akcích.', true, 10);

insert into public.pravidelne_akce (nazev, text, poradi) values
  ('Turnaj v šipkách', 'Pořádáme turnaj v šipkách 301 single out – zhruba jednou za měsíc. Konkrétní termín vždy upřesníme na Facebooku.', 10);

insert into public.hodiny (den, cas, poradi) values
  ('Pondělí – Čtvrtek', 'zavřeno', 10),
  ('Pátek', '17:00 – 22:00', 20),
  ('Sobota', '17:00 – 22:00', 30),
  ('Neděle', '17:00 – 22:00', 40);

insert into public.nastaveni (klic, hodnota) values
  ('banner', '>>> TENTO WEB JEŠTĚ DOPLŇUJEME – fotky a termíny akcí brzy <<<'),
  ('naposledy', '12. 10. 2026'),
  ('kuchyne_nadpis', 'Vaříme pouze z čerstvých surovin!'),
  ('kuchyne_text', 'Když u nás vaříme, snažíme se používat pouze čerstvé suroviny – bez umělých dochucovadel. Zážitek z čerstvě zpracovaných kvalitních surovin. Bez výmluv.');