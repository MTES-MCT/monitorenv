create table control_resources_temp (
    id serial primary key,
    unit_id integer references control_units(id) not null,
    name varchar not null
);
alter table control_resources_temp add unique (unit_id, name);

insert into control_resources_temp(name, unit_id)
    select distinct resource_name, control_units.id from control_resources
        inner join control_units on control_units.name = control_resources.unit
        WHERE resource_name IS NOT NULL;

drop table control_resources;
alter table control_resources_temp rename to control_resources;
ALTER SEQUENCE control_resources_temp_id_seq RENAME TO control_resources_id_seq;
