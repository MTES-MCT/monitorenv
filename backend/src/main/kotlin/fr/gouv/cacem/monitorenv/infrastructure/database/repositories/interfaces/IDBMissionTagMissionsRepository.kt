package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionTagMissionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionTagMissionPk
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.JpaRepository

@DynamicUpdate
interface IDBMissionTagMissionsRepository : JpaRepository<MissionTagMissionModel, MissionTagMissionPk>
