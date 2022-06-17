package fr.gouv.cacem.monitorenv.domain.entities.controlTopics

import org.locationtech.jts.geom.MultiPolygon

data class ControlTopicEntity(
        val id: Int,
        val topic_level_1: String,
        val topic_level_2: String? = null,
        val topic_level_3: String? = null
        )
