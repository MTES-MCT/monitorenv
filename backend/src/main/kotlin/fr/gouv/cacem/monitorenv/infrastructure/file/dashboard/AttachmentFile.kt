package fr.gouv.cacem.monitorenv.infrastructure.file.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.LinkEntity
import fr.gouv.cacem.monitorenv.utils.ByteArrayConverter
import fr.gouv.cacem.monitorenv.utils.WordUtils
import org.apache.poi.xwpf.usermodel.XWPFDocument
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class AttachmentFile : BriefFileWriter() {
    private val logger = LoggerFactory.getLogger(AttachmentFile::class.java)

    override fun createSection(
        brief: BriefEntity,
        document: XWPFDocument,
    ) {
        applyLinks(document, brief.dashboard.links)
        applyDashboardImages(document, brief.dashboard.images)
    }

    private fun applyLinks(
        document: XWPFDocument,
        links: List<LinkEntity>?,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${links}") }?.let { paragraph ->
            paragraph.runs.forEach { it.setText("", 0) }
            links?.forEach { link ->
                WordUtils.addHyperlink(null, link.linkUrl, link.linkText, document, paragraph)
                paragraph.createRun().addBreak()
            }
        }
    }

    private fun applyDashboardImages(
        document: XWPFDocument,
        images: List<ImageEntity>,
    ) {
        document.paragraphs.firstOrNull { it.text.contains("\${images}") }?.let { paragraph ->
            paragraph.runs.forEach { it.setText("", 0) }
            images.forEach { image ->
                ByteArrayConverter().createImageFromByteArray(image, paragraph)
                paragraph.createRun().addBreak()
            }
        }
    }
}
