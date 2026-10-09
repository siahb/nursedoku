begin;
-- Disposable transaction fixtures; every user/save/result is rolled back.
select set_config('nursedoku.test_a',gen_random_uuid()::text,true),set_config('nursedoku.test_b',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email) select current_setting(k)::uuid,'authenticated','authenticated',current_setting(k)||'@example.invalid' from unnest(array['nursedoku.test_a','nursedoku.test_b']) k;
insert into public.nursedoku_progress(user_id,progress)
select current_setting(k)::uuid,jsonb_build_object('game',jsonb_build_object('gameKind','daily','dailyDate','2026-10-09','finished',true,'lost',false,'rankEligible',true,'bonusSubmitted',true,'bonusQueue','[]'::jsonb,'bonusCursor',0,'strikes',0,'elapsed',42000,'customPuzzle',jsonb_build_object('solution','[1,3,5,0,2,4]'::jsonb),'state','[["","rn","","","",""],["","","","rn","",""],["","","","","","rn"],["rn","","","","",""],["","","rn","","",""],["","","","","rn",""]]'::jsonb)) from unnest(array['nursedoku.test_a','nursedoku.test_b']) k;
set local role authenticated;
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('nursedoku.test_a'),'role','authenticated')::text,true);
select public.nursedoku_publish_daily('Test Nurse A');
select public.nursedoku_publish_daily('Changed nickname');
do $$begin
 if has_table_privilege('authenticated','nursedoku_private.daily_scores','SELECT') then raise exception 'Direct access exposed';end if;
 begin perform public.nursedoku_publish_daily('email@example.com');raise exception 'Invalid nickname accepted';exception when raise_exception then if sqlerrm='Invalid nickname accepted' then raise;end if;end;
end$$;
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('nursedoku.test_b'),'role','authenticated')::text,true);
select public.nursedoku_publish_daily('Test Nurse B');
do $$begin
 if (select count(*) from public.nursedoku_daily_board('2026-10-09') where nickname like 'Test Nurse %' and rank=1)<>2 then raise exception 'Ties or first-entry retention failed';end if;
end$$;
-- Reject incomplete questions and hinted attempts from the caller's own save.
update public.nursedoku_progress set progress=jsonb_set(progress,'{game,bonusSubmitted}','false') where user_id=auth.uid();
do $$begin begin perform public.nursedoku_publish_daily('Test Nurse B');raise exception 'Incomplete questions accepted';exception when raise_exception then if sqlerrm='Incomplete questions accepted' then raise;end if;end;end$$;
update public.nursedoku_progress set progress=jsonb_set(jsonb_set(progress,'{game,bonusSubmitted}','true'),'{game,rankEligible}','false') where user_id=auth.uid();
do $$begin begin perform public.nursedoku_publish_daily('Test Nurse B');raise exception 'Hinted run accepted';exception when raise_exception then if sqlerrm='Hinted run accepted' then raise;end if;end;end$$;
select public.nursedoku_withdraw_daily();
do $$begin
 if exists(select 1 from public.nursedoku_daily_board('2026-10-09') where nickname='Test Nurse B') or not exists(select 1 from public.nursedoku_daily_board('2026-10-09') where nickname='Test Nurse A') then raise exception 'Cross-account removal isolation failed';end if;
 if (select count(*) from public.nursedoku_progress where user_id=auth.uid())<>1 then raise exception 'Private save deleted';end if;
end$$;
set local role anon;
select set_config('request.jwt.claims','{}',true);
select * from public.nursedoku_daily_board('2026-10-09');
do $$begin
 if has_table_privilege('anon','nursedoku_private.daily_scores','SELECT') then raise exception 'Private table exposed';end if;
 if has_function_privilege('anon','public.nursedoku_publish_daily(text)','EXECUTE') then raise exception 'Guest publishing allowed';end if;
 if has_function_privilege('anon','public.nursedoku_withdraw_daily()','EXECUTE') then raise exception 'Guest removal allowed';end if;
end$$;
reset role;
select 'PASS: authenticated publication, immutable first result, ties, question/hint rejection, private tables, public guest read, owner-only removal and preserved private saves' as result;
rollback;
