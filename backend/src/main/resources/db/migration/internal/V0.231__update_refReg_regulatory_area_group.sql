UPDATE regulatory_areas re
SET type               = source.type,
    url                = source.url,
    ref_reg            = source.ref_reg,
    date               = source.date,
    date_fin           = source.date_fin,
    additional_ref_reg = source.additional_ref_reg
FROM (SELECT DISTINCT ON (rag.group_id) rag.group_id,
                                        source_re.type,
                                        source_re.url,
                                        source_re.ref_reg,
                                        source_re.date,
                                        source_re.date_fin,
                                        source_re.additional_ref_reg
      FROM regulatory_areas_group rag
               JOIN regulatory_areas source_re
                    ON source_re.id = rag.regulatory_area_id
      ORDER BY rag.group_id, rag.regulatory_area_id) source
WHERE re.id = source.group_id
  AND re.area_type = 'GROUP';