package fr.gouv.cacem.monitorenv.domain.entities

import com.fasterxml.jackson.databind.JsonNode

data class PatchableEntity(
    val jsonNode: JsonNode,
)
