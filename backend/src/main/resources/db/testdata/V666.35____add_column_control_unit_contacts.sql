/* Move phone numbers starting with 06, 07, +881 6/7, or +594 6/7 to the cell_phone column */
UPDATE control_unit_contacts
SET cell_phone = phone,
    phone = NULL
WHERE phone ~ '^\s*(0[67]|\+(881|594)\s*[67])';

/* Move predefined contact names to the role column, keep custom names in name */
UPDATE control_unit_contacts
SET role = name,
    name = ''
WHERE name IN (
    'Adjoint',
    'Passerelle',
    'Commandant',
    'Commandant bordée A',
    'Commandant bordée B',
    'Équipage A',
    'Équipage B',
    'DML',
    'Quai',
    'Terre',
    'Permanence terre',
    'Proche côte',
    'Bureau de l’unité',
    'Téléphone de bord',
    'Permanence',
    'Centre opérationnel',
    'Centre opérationnel - HNO',
    'Centre opérationnel - HO',
    'Contact permanent à bord',
    'Mer',
    'Secrétariat',
    'Chef de service',
    'Chef d’unité',
    'Nom de contact à renseigner'
);
