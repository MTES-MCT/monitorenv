package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlTopics.ControlTopicEntity

data class ControlTopicDataOutput(
    val id: Int,
    val topic_level_1: String,
    val topic_level_2: String? = null,
    val topic_level_3: String? = null,
) {
    companion object {
        fun fromControlTopicEntity(controlTopic: ControlTopicEntity) = ControlTopicDataOutput(
            id = controlTopic.id,
            topic_level_1 = controlTopic.topic_level_1,
            topic_level_2 = controlTopic.topic_level_2,
            topic_level_3 = controlTopic.topic_level_3
        )
    }
}
