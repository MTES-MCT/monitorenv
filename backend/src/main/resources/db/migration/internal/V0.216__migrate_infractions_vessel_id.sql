UPDATE env_actions
SET value = jsonb_set(
        value,
        '{infractions}',
        (SELECT jsonb_agg(
                        (infraction - 'vesselId') || jsonb_build_object(
                                'vesselShipId', v.ship_id,
                                'vesselBatchId', v.batch_id,
                                'vesselRowNumber', v.row_number
                                                     )
                )
         FROM jsonb_array_elements(value -> 'infractions') AS infraction
                  LEFT JOIN vessels v ON v.id = (infraction ->> 'vesselId')::int)
            )
WHERE EXISTS (SELECT 1
              FROM jsonb_array_elements(value -> 'infractions') AS infraction
              WHERE infraction -> 'vesselId' <> 'null');