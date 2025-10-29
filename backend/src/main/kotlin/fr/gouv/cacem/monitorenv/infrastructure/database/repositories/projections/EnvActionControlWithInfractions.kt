package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.projections

import java.sql.Timestamp
import java.util.UUID

interface EnvActionControlWithInfractions {
    fun getId(): UUID

    fun getActionStartDatetimeUtc(): Timestamp

    fun getInfractions(): String

    fun getControlUnits(): Array<String>

    fun getThemes(): Array<String>
}
