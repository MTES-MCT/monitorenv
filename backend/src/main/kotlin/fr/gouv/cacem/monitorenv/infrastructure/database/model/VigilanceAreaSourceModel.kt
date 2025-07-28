package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaSourceEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import org.hibernate.Hibernate
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
    @JsonBackReference
    val vigilanceArea: VigilanceAreaModel,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_unit_contacts_id")
    @JsonBackReference
    val controlUnitContact: ControlUnitContactModel?,
    @Column(name = "name") val name: String?,
    @Column(name = "email") val email: String?,
    @Column(name = "phone") val phone: String?,
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
                            )
                        }
                    }
                }
        }
    }
}
