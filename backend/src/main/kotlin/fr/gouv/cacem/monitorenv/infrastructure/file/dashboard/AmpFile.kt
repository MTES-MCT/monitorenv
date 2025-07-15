package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.springframework.stereotype.Component

@Component
class AmpFile : BriefFileWriter() {
    override fun createSection(
        brief: BriefEntity,
        document: XWPFDocument,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${ampsDetails}") }?.let { paragraph ->
            createDetailsSection(paragraph, brief.amps)
        }
    }
}
