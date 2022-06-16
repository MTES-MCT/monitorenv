package fr.gouv.cacem.monitorenv.infrastructure.database.model


import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlResourceEntity
import javax.persistence.*

@Entity
@Table(name = "control_resources")
data class ControlResourceModel(
  @Id
  @Column(name = "id")
  var id: Int,
  @Column(name = "facade")
  var facade: String?,
  @Column(name = "administration")
  var administration: String?,
  @Column(name = "resource_name")
  var resource_name: String?,
  @Column(name = "size")
  var size: String?,
  @Column(name = "name")
  var name: String?,
  @Column(name = "city")
  var city: String?,
  @Column(name = "type")
  var type: String?,
  @Column(name = "intervention_zone")
  var intervention_zone: String?,
  @Column(name = "telephone")
  var telephone: String?,
  @Column(name = "mail")
  var mail: String?,
  @Column(name = "unit")
  var unit: String?,
) {
  fun toControlResource() = ControlResourceEntity(
    id = id,
    facade = facade,
    administration = administration,
    resource_name = resource_name,
    size = size,
    name = name,
    city = city,
    type = type,
    intervention_zone = intervention_zone,
    telephone = telephone,
    mail = mail,
    unit = unit,
  )

  companion object {
    fun fromControlResourceEntity(controlResource: ControlResourceEntity) = ControlResourceModel(
      id = controlResource.id,
      facade = controlResource.facade,
      administration = controlResource.administration,
      resource_name = controlResource.resource_name,
      size = controlResource.size,
      name = controlResource.name,
      city = controlResource.city,
      type = controlResource.type,
      intervention_zone = controlResource.intervention_zone,
      telephone = controlResource.telephone,
      mail = controlResource.mail,
      unit = controlResource.unit,
    )
  }
}
