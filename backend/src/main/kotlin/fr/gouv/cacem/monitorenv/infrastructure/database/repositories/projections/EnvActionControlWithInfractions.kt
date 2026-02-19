package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.projections

import java.time.LocalDateTime
import java.util.UUID

interface EnvActionControlWithInfractions {
    fun getId(): UUID

    fun getMissionId(): Int

    fun getActionStartDatetimeUtc(): LocalDateTime?

    fun getInfractions(): String

    fun getControlUnits(): Array<String>

    fun getThemes(): Array<String>
}
