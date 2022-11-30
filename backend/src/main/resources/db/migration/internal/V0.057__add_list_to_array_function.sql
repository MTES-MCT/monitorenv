-- ISSUE trying to convert list<String> to postgresql text[]
-- See https://stackoverflow.com/questions/55169797/pass-liststring-into-postgres-function-as-parameter
-- Convert the bytea argument to null.
-- Used to convert Java null to PostgreSQL null
--
create or replace function list_to_array(_list bytea) returns text[] language sql as $$
select null::text[];
$$;

-- Convert a variable number of text arguments to text array
-- Used to convert Java collection to the text array
--
create or replace function list_to_array(variadic _list text[]) returns text[] language sql as $$
select _list;
$$;