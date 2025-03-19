package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.security.input

import kotlinx.serialization.Serializable

@Serializable
data class UserInfo(
    val email: String,
)
