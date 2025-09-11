package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaSourceEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea.VigilanceAreaSourceInput
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import java.util.UUID

private val polygon =
    WKTReader()
        .read(
            "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
        ) as MultiPolygon

class VigilanceAreaSourceFixture {
    companion object {
        fun aVigilanceAreaSource(
            id: UUID? = null,
            name: String = "source",
            isAnonymous: Boolean = false,
            comments: String? = null,
            link: String? = null,
            type: SourceTypeEnum = SourceTypeEnum.OTHER,
        ): VigilanceAreaSourceEntity =
            VigilanceAreaSourceEntity(
                id = id,
                name = name,
                controlUnitContacts = null,
                phone = null,
                email = null,
                comments = comments,
                link = link,
                type = type,
                isAnonymous = isAnonymous,
            )

        fun aVigilanceAreaSourceInput(
            id: UUID? = null,
            name: String = "source",
            isAnonymous: Boolean = false,
            comments: String? = null,
            link: String? = null,
            type: SourceTypeEnum = SourceTypeEnum.OTHER,
        ): VigilanceAreaSourceInput =
            VigilanceAreaSourceInput(
                id = id,
                name = name,
                controlUnitContacts = null,
                phone = null,
                email = null,
                comments = comments,
                link = link,
                type = type,
                isAnonymous = isAnonymous,
            )
    }
}
