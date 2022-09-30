package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
import fr.gouv.cacem.monitorenv.domain.entities.missions.*

import com.fasterxml.jackson.annotation.*
import com.fasterxml.jackson.databind.ObjectMapper
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import org.hibernate.Hibernate
import org.hibernate.annotations.NaturalId
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import org.hibernate.annotations.TypeDefs
import java.util.*
import javax.persistence.*

@JsonIdentityInfo(
  generator = ObjectIdGenerators.PropertyGenerator::class,
  property = "id")
@Entity
@TypeDefs(
  TypeDef(name = "jsonb",
    typeClass = JsonBinaryType::class)
)
@Table(name = "env_actions")
data class EnvActionModel(
  @Id
  @NaturalId
  @Column(name = "id")
    var id: UUID,

  @Column(name = "action_type")
  @Enumerated(EnumType.STRING)
    var actionType: ActionTypeEnum,
  @Type(type = "jsonb")
  @Column(name = "value", columnDefinition = "jsonb")
    var value: String,
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "mission_id")
  @JsonBackReference
  var mission: MissionModel
) {

  fun toActionEntity(mapper: ObjectMapper): EnvActionEntity {
      return EnvActionMapper.getEnvActionEntityFromJSON(mapper, value, actionType, id)
  }
  companion object {
    fun fromEnvActionEntity(action: EnvActionEntity, mission: MissionModel,  mapper: ObjectMapper) = EnvActionModel(
      id = action.id,
      actionType = action.actionType,
      value = mapper.writeValueAsString(action),
      mission = mission
    )
  }

  override fun equals(other: Any?): Boolean {
    if (this === other) return true
    if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
    other as EnvActionModel

    return id != null && id == other.id
  }

  override fun hashCode(): Int = javaClass.hashCode()

  @Override
  override fun toString(): String {
    return this::class.simpleName + "(id = $id , actionType = $actionType , value = $value )"
  }
}