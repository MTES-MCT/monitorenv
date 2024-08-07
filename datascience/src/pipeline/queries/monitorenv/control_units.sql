SELECT
    cu.id  AS control_unit_id,
    cu.name AS control_unit_name,
    ARRAY_AGG(DISTINCT email) AS email_addresses
FROM control_units cu
JOIN control_unit_contacts cuc
ON cu.id = cuc.control_unit_id
WHERE
    email IS NOT NULL
    AND is_email_subscription_contact
    AND NOT archived
    AND cu.id IN :control_unit_ids
GROUP BY 1, 2
ORDER BY 1, 2
