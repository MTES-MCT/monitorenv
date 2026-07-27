package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

import fr.gouv.cacem.monitorenv.domain.entities.Patchable

data class ControlUnitResourceEntity(
    val id: Int? = null,
    val controlUnitId: Int,
    val isArchived: Boolean,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = null,
    @Patchable
    var radioFrequency: String?,
    @Patchable
    var registrationId: String?,
    val stationId: Int?,
    val type: ControlUnitResourceType,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ControlUnitResourceEntity

        if (id != other.id) return false
        if (controlUnitId != other.controlUnitId) return false
        if (isArchived != other.isArchived) return false
        if (stationId != other.stationId) return false
        if (name != other.name) return false
        if (note != other.note) return false
        if (!photo.contentEquals(other.photo)) return false
        if (radioFrequency != other.radioFrequency) return false
        if (registrationId != other.registrationId) return false
        if (type != other.type) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + controlUnitId
        result = 31 * result + isArchived.hashCode()
        result = 31 * result + stationId
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + (radioFrequency?.hashCode() ?: 0)
        result = 31 * result + (registrationId?.hashCode() ?: 0)
        result = 31 * result + (stationId ?: 0)
        result = 31 * result + type.hashCode()
        return result
    }
}
