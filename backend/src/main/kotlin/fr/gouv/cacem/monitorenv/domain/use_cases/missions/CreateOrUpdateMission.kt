package fr.gouv.cacem.monitorenv.domain.use_cases.missions // ktlint-disable package-name

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

@UseCase
class CreateOrUpdateMission(
    private val departmentRepository: IDepartmentAreasRepository,
    private val missionRepository: IMissionRepository,
    private val facadeRepository: IFacadeAreasRepository,

) {
    @Throws(IllegalArgumentException::class)
    fun execute(mission: MissionEntity?): MissionEntity {
        require(mission != null) {
            "No mission to create or update"
        }
        val envActions = mission.envActions?.map {
            when (it.actionType) {
                ActionTypeEnum.CONTROL -> {
                    (it as EnvActionControlEntity).copy(
                        facade = (it.geom ?: mission.geom)?.let { geom -> facadeRepository.findFacadeFromGeometry(geom) },
                        department = (it.geom ?: mission.geom)?.let { geom -> departmentRepository.findDepartmentFromGeometry(geom) },
                    )
                }
                ActionTypeEnum.SURVEILLANCE -> {
                    val surveillance = it as EnvActionSurveillanceEntity
                    /*
                    When coverMissionZone is true, use mission geometry in priority, fall back to action geometry.
                    When coverMissionZone is not true, prioritize the other way around.
                    Ideally the fallbacks should not be needed, but if coverMissionZone is true and the mission geom
                    is null, or if coverMissionZone is false and the action geom is null, then rather that nothing,
                    better use the geometry that is available, if any.
                    */
                    val geometry = if (surveillance.coverMissionZone == true) (mission.geom ?: surveillance.geom) else (surveillance.geom ?: mission.geom)
                    surveillance.copy(
                        facade = geometry?.let { geom -> facadeRepository.findFacadeFromGeometry(geom) },
                        department = geometry?.let { geom -> departmentRepository.findDepartmentFromGeometry(geom) },
                    )
                }
                ActionTypeEnum.NOTE -> {
                    (it as EnvActionNoteEntity).copy()
                }
            }
        }

        var facade: String? = null

        if (mission.geom != null) {
            facade = facadeRepository.findFacadeFromGeometry(mission.geom)
        }

        val missionToSave = mission.copy(
            facade = facade,
            envActions = envActions,
        )

        return missionRepository.save(missionToSave)
    }
}
