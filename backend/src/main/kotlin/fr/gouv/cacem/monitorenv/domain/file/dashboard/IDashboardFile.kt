package fr.gouv.cacem.monitorenv.domain.file.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefFileEntity

interface IDashboardFile {
    fun createEditableBrief(brief: BriefEntity): BriefFileEntity
}
