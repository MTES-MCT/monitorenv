create table administrations (
    id serial primary key,
    name varchar not null unique
);

insert into administrations(name)
    select distinct administration from control_resources;
