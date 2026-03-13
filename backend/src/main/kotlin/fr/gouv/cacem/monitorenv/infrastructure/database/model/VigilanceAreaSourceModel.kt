package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaSourceEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType
import java.util.UUID

@Entity
@Table(name = "vigilance_areas_source")
class VigilanceAreaSourceModel(
    @Id
    @Column(name = "id", unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID?,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vigilance_areas_id", nullable = false)
    val vigilanceArea: VigilanceAreaModel,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_unit_contacts_id")
    val controlUnitContact: ControlUnitContactModel?,
    @Column(name = "name") val name: String?,
    @Column(name = "email") val email: String?,
    @Column(name = "phone") val phone: String?,
    @Column(name = "comments") val comments: String?,
    @Column(name = "link") val link: String?,
    @Column(name = "is_anonymous", nullable = false) val isAnonymous: Boolean = false,
    @Column(name = "type", columnDefinition = "vigilance_area_source_type", nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val type: SourceTypeEnum,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as VigilanceAreaSourceModel

        return id != null && id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()

    companion object {
        fun fromVigilanceAreaSource(
            vigilanceAreaSource: VigilanceAreaSourceEntity,
            controlUnitContact: ControlUnitContactModel?,
            vigilanceArea: VigilanceAreaModel,
        ) = VigilanceAreaSourceModel(
            id = null,
            vigilanceArea = vigilanceArea,
            controlUnitContact = controlUnitContact,
            name = vigilanceAreaSource.name,
            email = vigilanceAreaSource.email,
            phone = vigilanceAreaSource.phone,
            comments = vigilanceAreaSource.comments,
            link = vigilanceAreaSource.link,
            isAnonymous = vigilanceAreaSource.isAnonymous,
            type = vigilanceAreaSource.type,
        )

        fun toVigilanceAreaSources(
            vigilanceAreaSourceModel: List<VigilanceAreaSourceModel>,
        ): List<VigilanceAreaSourceEntity> {
            return vigilanceAreaSourceModel
                .groupBy { it.controlUnitContact?.controlUnit?.id }
                .flatMap { (controlUnitId, sources) ->
                    return@flatMap if (controlUnitId != null) {
                        listOf(
                            VigilanceAreaSourceEntity(
                                id = null,
                                controlUnitContacts =
                                    sources.mapNotNull { source ->
                                        source.controlUnitContact?.toControlUnitContact()
                                    },
                                name = null,
                                phone = null,
                                email = null,
                                link = null,
                                comments = sources.firstOrNull { it.comments != null }?.comments,
                                isAnonymous = sources.any { it.isAnonymous },
                                type = SourceTypeEnum.CONTROL_UNIT,
                            ),
                        )
                    } else {
                        return@flatMap sources.map { source ->
                            VigilanceAreaSourceEntity(
                                id = source.id,
                                controlUnitContacts = null,
                                name = source.name,
                                phone = source.phone,
                                email = source.email,
                                link = source.link,
                                comments = source.comments,
                                isAnonymous = source.isAnonymous,
                                type = source.type,
                            )
                        }
                    }
                }
        }
    }
}
