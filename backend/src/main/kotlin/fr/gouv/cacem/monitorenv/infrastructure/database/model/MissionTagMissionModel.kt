package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table
import java.io.Serializable

@Entity
@Table(name = "mission_tags_missions")
class MissionTagMissionModel(
    @EmbeddedId
    var id: MissionTagMissionPk,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mission_tags_id")
    @MapsId("missionTagId")
    val missionTag: MissionTagModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "missions_id")
    @MapsId("missionId")
    val mission: MissionModel,
) {
    companion object {
        fun fromMissionTagEntity(
            missionTag: MissionTagEntity,
            mission: MissionModel,
        ): MissionTagMissionModel =
            MissionTagMissionModel(
                id = MissionTagMissionPk(missionTag.id, mission.id),
                missionTag = MissionTagModel.fromMissionTagEntity(missionTag),
                mission = mission,
            )
    }

    fun toMissionTagEntity(): MissionTagEntity = missionTag.toMissiontagEntity()
}

@Embeddable
class MissionTagMissionPk(
    val missionTagId: Int?,
    val missionId: Int?,
) : Serializable
