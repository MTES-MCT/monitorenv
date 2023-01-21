create table control_units (
    id serial primary key,
    administration_id integer references administrations(id) not null,
    name varchar not null,
    deleted boolean not null default false
);

alter table control_units add unique (administration_id, name);

-- Old POSEIDON unit entries are not overlapped
ALTER SEQUENCE IF EXISTS public.control_units_id_seq RESTART WITH 10000;

insert into control_units(name, administration_id)
    select distinct unit, administrations.id from control_resources
    inner join administrations on administrations.name = control_resources.administration;
