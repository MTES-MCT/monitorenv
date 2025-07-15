package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import org.apache.poi.xwpf.usermodel.XWPFDocument

fun interface IBriefFileWriter {
    fun createSection(
        brief: BriefEntity,
        document: XWPFDocument,
    )
}
