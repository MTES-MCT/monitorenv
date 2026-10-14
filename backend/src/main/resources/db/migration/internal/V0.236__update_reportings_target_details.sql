-- Mise à jour de la structure des objets du tableau JSONB `target_details`
--
-- Renommages :
--   externalReferenceNumber -> registrationNumber
--   operatorName            -> controlledPersonIdentity
--   size                    -> vesselSize
--
-- Nouvelles propriétés (vesselBatchId, vesselRowNumber, vesselShipId) :
--   absentes des anciennes données, elles seront désérialisées à null.
--
-- Inchangées : mmsi, imo, vesselName, vesselType

UPDATE reportings
SET target_details = (
    SELECT jsonb_agg(
        (elem - 'externalReferenceNumber' - 'operatorName' - 'size')
        || jsonb_strip_nulls(
            jsonb_build_object(
                'registrationNumber', elem -> 'externalReferenceNumber',
                'controlledPersonIdentity', elem -> 'operatorName',
                'vesselSize', elem -> 'size'
            )
        )
    )
    FROM jsonb_array_elements(target_details) AS elem
)
WHERE jsonb_typeof(target_details) = 'array'
  AND jsonb_array_length(target_details) > 0;
