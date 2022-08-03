package fr.gouv.cacem.monitorenv.domain.entities.missions

import java.util.UUID

data class EnvActionNoteEntity (
  override val id: UUID,
  val observations: String? = null,
): EnvActionEntity(
  actionType = ActionTypeEnum.NOTE,
  id = id
)