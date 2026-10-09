create schema if not exists nursedoku_private;
revoke all on schema nursedoku_private from public;
grant usage on schema nursedoku_private to anon, authenticated;
create table nursedoku_private.daily_scores (
 user_id uuid not null references auth.users(id) on delete cascade,
 day date not null,
 nickname text not null check (nickname ~ '^[A-Za-z0-9 _-]{2,24}$'),
 elapsed_ms integer not null check (elapsed_ms between 1000 and 86400000),
 strikes integer not null check (strikes between 0 and 2),
 created_at timestamptz not null default now(),
 primary key (user_id, day)
);
alter table nursedoku_private.daily_scores enable row level security;
revoke all on nursedoku_private.daily_scores from public, anon, authenticated;
create index daily_scores_ranking on nursedoku_private.daily_scores(day, elapsed_ms, strikes);

-- Public output deliberately omits account IDs and email addresses.
create function nursedoku_private.daily_board(p_day date)
returns table(rank bigint,nickname text,elapsed_ms integer,strikes integer)
language sql stable security definer set search_path = '' as $$
 select rank() over(order by s.elapsed_ms,s.strikes), s.nickname,s.elapsed_ms,s.strikes
 from nursedoku_private.daily_scores s where s.day=p_day
 order by s.elapsed_ms,s.strikes,s.created_at,s.user_id limit 50;
$$;
create function public.nursedoku_daily_board(p_day date)
returns table(rank bigint,nickname text,elapsed_ms integer,strikes integer)
language sql stable security invoker set search_path = '' as $$
 select * from nursedoku_private.daily_board(p_day);
$$;

-- The caller supplies a nickname only. Results are read from their own cloud save.
create function nursedoku_private.publish_daily(p_nickname text)
returns void language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); g jsonb; d date; ms integer; s integer; n integer; r integer; c integer; q integer;
begin
 if uid is null then raise exception 'Sign in to publish a result.'; end if;
 if p_nickname is null or btrim(p_nickname) !~ '^[A-Za-z0-9 _-]{2,24}$' then raise exception 'Use a nickname with 2-24 letters, numbers, spaces, underscores or hyphens.'; end if;
 select progress->'game' into g from public.nursedoku_progress where user_id=uid;
 if g is null or g->>'gameKind' <> 'daily' or g->>'finished' is distinct from 'true'
 or g->>'lost' is distinct from 'false' or g->>'rankEligible' is distinct from 'true'
 or g->>'bonusSubmitted' is distinct from 'true' then
  raise exception 'Finish a new daily shift without hints or resets, answer its NCLEX questions, then sync.';
 end if;
 q:=jsonb_array_length(g->'bonusQueue');
 if q>0 and (g->>'bonusCursor')::integer<>q-1 then raise exception 'Answer all NCLEX questions first.'; end if;
 d:=(g->>'dailyDate')::date;
 if d is null or d<date '2026-09-29' or d>(now() at time zone 'UTC')::date+1 then raise exception 'Invalid daily date.'; end if;
 ms:=ceil((g->>'elapsed')::numeric/1000)::integer*1000; s:=(g->>'strikes')::integer;
 n:=jsonb_array_length(g->'state');
 if n<>6 or jsonb_array_length(g#>'{customPuzzle,solution}')<>n then raise exception 'Invalid daily board.'; end if;
 for r in 0..n-1 loop
  if jsonb_array_length(g->'state'->r)<>n then raise exception 'Invalid board row.'; end if;
  for c in 0..n-1 loop
   if ((g->'state'->r->>c)='rn') is distinct from ((g#>'{customPuzzle,solution}'->>r)::integer=c) then raise exception 'The daily board is not solved.'; end if;
  end loop;
 end loop;
 insert into nursedoku_private.daily_scores(user_id,day,nickname,elapsed_ms,strikes)
 values(uid,d,btrim(p_nickname),ms,s) on conflict(user_id,day) do nothing;
end;
$$;
create function public.nursedoku_publish_daily(p_nickname text)
returns void language sql security invoker set search_path = '' as $$ select nursedoku_private.publish_daily(p_nickname); $$;
create function nursedoku_private.withdraw_daily()
returns void language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null then raise exception 'Sign in to remove your results.'; end if;
 delete from nursedoku_private.daily_scores where user_id=auth.uid();
end;
$$;
create function public.nursedoku_withdraw_daily()
returns void language sql security invoker set search_path = '' as $$ select nursedoku_private.withdraw_daily(); $$;
revoke all on function nursedoku_private.daily_board(date), public.nursedoku_daily_board(date), nursedoku_private.publish_daily(text), public.nursedoku_publish_daily(text), nursedoku_private.withdraw_daily(), public.nursedoku_withdraw_daily() from public,anon,authenticated;
grant execute on function nursedoku_private.daily_board(date),public.nursedoku_daily_board(date) to anon,authenticated;
grant execute on function nursedoku_private.publish_daily(text),public.nursedoku_publish_daily(text),nursedoku_private.withdraw_daily(),public.nursedoku_withdraw_daily() to authenticated;
