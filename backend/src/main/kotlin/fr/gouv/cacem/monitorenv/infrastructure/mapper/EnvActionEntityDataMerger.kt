package fr.gouv.cacem.monitorenv.infrastructure.mapper

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.interactors.IDataMerger
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.MappingTarget

@Mapper
interface EnvActionEntityDataMerger : IDataMerger<EnvActionEntity> {
    @Mapping(target = "id", ignore = true)
    override fun merge(
        source: EnvActionEntity,
        @MappingTarget target: EnvActionEntity,
    ): EnvActionEntity
}
