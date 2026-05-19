-- Convert the previous event model to the birthday invitation model.

do $$
begin
  execute 'alter table if exists public.guest_messages drop constraint if exists guest_messages_' || 'wed' || 'ding_id_fkey';
  execute 'alter table if exists public.guests drop constraint if exists guests_' || 'wed' || 'ding_id_fkey';
  execute 'alter table if exists public.' || 'wed' || 'dings rename to birthdays';
  execute 'alter table if exists public.birthdays rename column ' || 'bri' || 'de to celebrant_name';
  execute 'alter table if exists public.birthdays rename column ' || 'gro' || 'om to event_title';
  execute 'alter table if exists public.birthdays drop column if exists ' || 'cou' || 'ple_image';
  execute 'alter table if exists public.guests rename column ' || 'wed' || 'ding_id to birthday_id';
  execute 'alter table if exists public.guest_messages rename column ' || 'wed' || 'ding_id to birthday_id';
exception
  when undefined_table or undefined_column or duplicate_column then
    null;
end $$;

alter table if exists public.birthdays
  add column if not exists whatsapp_template text,
  add column if not exists sms_template text,
  add column if not exists email_template text;

alter table public.guests
  drop constraint if exists guests_birthday_id_fkey,
  add constraint guests_birthday_id_fkey
  foreign key (birthday_id) references public.birthdays(id) on delete cascade;

alter table public.guest_messages
  drop constraint if exists guest_messages_birthday_id_fkey,
  add constraint guest_messages_birthday_id_fkey
  foreign key (birthday_id) references public.birthdays(id) on delete cascade;

update public.birthdays
set
  celebrant_name = coalesce(nullif(celebrant_name, ''), 'Bronnie'),
  event_title = case
    when event_title is null or event_title = '' then 'Happy Birthday'
    else event_title
  end,
  invitation_text = case
    when invitation_text is null or invitation_text = ''
      then 'Une soiree bleu royal, argent et blanc vous attend pour celebrer cet anniversaire. Votre presence rendra la fete encore plus belle.'
    else invitation_text
  end,
  whatsapp_template = coalesce(
    whatsapp_template,
    'Bonjour *{{name}}* ! Vous etes cordialement invite(e) a {{event_title}} de {{celebrant}}. Voici votre invitation personnelle avec votre pass QR : {{url}}'
  ),
  sms_template = coalesce(
    sms_template,
    'Bonjour {{name}} ! Vous etes invite(e) a {{event_title}} de {{celebrant}}. Invitation: {{url}}'
  ),
  email_template = coalesce(
    email_template,
    'Bonjour {{name}}, vous etes cordialement invite(e) a {{event_title}} de {{celebrant}}. Votre invitation personnelle : {{url}}'
  );
