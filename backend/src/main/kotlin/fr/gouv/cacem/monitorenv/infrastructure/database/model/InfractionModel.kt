package fr.gouv.cacem.monitorenv.infrastructure.database.model


import fr.gouv.cacem.monitorenv.domain.entities.infractions.InfractionEntity
import javax.persistence.*

@Entity
@Table(name = "infractions")
data class InfractionModel(
  @Id
  @Column(name = "id")
  var id: Int,
  @Column(name = "natinf_code")
  var natinf_code: String,
  @Column(name = "regulation")
  var regulation: String?,
  @Column(name = "infraction_category")
  var infraction_category: String?,
  @Column(name = "infraction")
  var infraction: String?,
) {
  fun toInfraction() = InfractionEntity(
    id = id,
    natinf_code = natinf_code,
    regulation = regulation,
    infraction_category = infraction_category,
    infraction = infraction
  )

  companion object {
    fun fromInfractionEntity(infraction: InfractionEntity) = InfractionModel(
      id = infraction.id,
      natinf_code = infraction.natinf_code,
      regulation = infraction.regulation,
      infraction_category = infraction.infraction_category,
      infraction = infraction.infraction
    )
  }
}
