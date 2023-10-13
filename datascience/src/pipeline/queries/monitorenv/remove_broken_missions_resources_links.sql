DELETE FROM missions_control_resources
WHERE control_resource_id NOT IN (SELECT id FROM control_unit_resources)