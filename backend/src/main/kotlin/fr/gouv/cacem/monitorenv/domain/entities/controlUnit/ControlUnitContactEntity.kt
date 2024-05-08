package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

data class ControlUnitContactEntity(
    val id: Int? = null,
    val controlUnitId: Int,
    val email: String? = null,
    val isEmailSubscriptionContact: Boolean,
    val isSmsSubscriptionContact: Boolean,
    val name: String,
    val phone: String? = null,
)
