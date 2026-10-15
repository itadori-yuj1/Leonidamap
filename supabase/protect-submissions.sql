-- Защита заявок. Выполнить один раз: Supabase → SQL Editor → Run.
-- NOT VALID: правила действуют для новых записей, старые не проверяются.

-- 1. Ограничения на поля
alter table public.locations drop constraint if exists locations_category_check;
alter table public.locations add constraint locations_category_check
  check (category in ('weapons','vehicles','events','eastereggs','underwater','activities')) not valid;

alter table public.locations drop constraint if exists locations_rarity_check;
alter table public.locations add constraint locations_rarity_check
  check (rarity is null or rarity in ('common','rare','unique')) not valid;

alter table public.locations drop constraint if exists locations_text_len_check;
alter table public.locations add constraint locations_text_len_check
  check (char_length(name) between 1 and 80
     and char_length(description) between 1 and 1000
     and (contact is null or char_length(contact) <= 100)) not valid;

alter table public.locations drop constraint if exists locations_xy_check;
alter table public.locations add constraint locations_xy_check
  check (x between 0 and 8192 and y between 0 and 8192) not valid;

alter table public.locations drop constraint if exists locations_images_len_check;
alter table public.locations add constraint locations_images_len_check
  check (images is null or jsonb_typeof(images) <> 'array' or jsonb_array_length(images) <= 3) not valid;

-- 2. Политика анонимной вставки (verified = false) уже существует:
--    "Anyone can suggest unverified locations" — повторно не создаём.

-- 3. Storage: bucket заявок — не больше 2 МБ, только jpeg/png
update storage.buckets
   set file_size_limit = 2097152,
       allowed_mime_types = array['image/jpeg','image/png']
 where id = 'submissions';
