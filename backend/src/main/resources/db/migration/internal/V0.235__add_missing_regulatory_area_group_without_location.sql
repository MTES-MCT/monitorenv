INSERT INTO regulatory_areas_group (regulatory_area_id, group_id)
    (SELECT reg.id, gr.id
     FROM regulatory_areas reg
              INNER JOIN regulatory_areas gr
                         ON reg.layer_name = gr.layer_name
                             AND gr.location IS NULL
                             AND reg.location IS NULL
                             AND gr.area_type = 'GROUP' AND reg.area_type = 'ZONE'
     WHERE NOT EXISTS (SELECT 1
                       FROM regulatory_areas_group rag
                       WHERE rag.regulatory_area_id = reg.id
                         AND rag.group_id = gr.id));