from src.pipeline.flows.regulations import flow as flow_regulations
from src.pipeline.flows.facade_areas import flow as flow_facade_areas
from src.pipeline.flows.fao_areas import flow as flow_fao_areas
from src.pipeline.flows.admin_areas import flow as flow_admin_areas

flow_regulations.run()
flow_facade_areas.run()
flow_fao_areas.run()
flow_admin_areas.run()