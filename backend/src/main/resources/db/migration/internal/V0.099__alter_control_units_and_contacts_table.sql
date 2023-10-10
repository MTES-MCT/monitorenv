ALTER TABLE public.control_units
    ADD COLUMN department_area_insee_dep VARCHAR,
    ADD CONSTRAINT fk_control_units_department_area_insee_dep_departments_areas
        FOREIGN KEY (department_area_insee_dep)
        REFERENCES departments_areas(insee_dep)
        ON DELETE SET NULL;

ALTER TABLE public.control_unit_contacts
    DROP COLUMN note;
