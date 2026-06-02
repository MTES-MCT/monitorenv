package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "mission_tags")
class MissionTagModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,
    val name: String,
    val isArchived: Boolean,
) {
    fun toMissiontagEntity(): MissionTagEntity =
        MissionTagEntity(
            id = id,
            name = name,
            isArchived = isArchived,
        )

    companion object {
        fun fromMissionTagEntity(missionTagEntity: MissionTagEntity): MissionTagModel {
            val tagModel =
                MissionTagModel(
                    id = missionTagEntity.id,
                    name = missionTagEntity.name,
                    isArchived = missionTagEntity.isArchived,
                )
            return tagModel
        }
    }
}
