package fr.gouv.cacem.monitorenv.infrastructure.mapper

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import fr.gouv.cacem.monitorenv.domain.entities.PatchableEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.interactors.IDataPatcher
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.Patchable
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestErrorCode
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestException
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import kotlin.reflect.KClass
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.hasAnnotation

@Component
class PatchData<T : Any>(
    @Qualifier("objectMapper") private val objectMapper: ObjectMapper,
) : IDataPatcher<T> {
    override fun execute(entity: T, patchableEntity: PatchableEntity, kClass: KClass<T>): T {
        try {
            val jsonNode = patchableEntity.jsonNode
            val entityJson = objectMapper.valueToTree<JsonNode>(entity)
            val patchableProperties =
                kClass.declaredMemberProperties.filter { it.hasAnnotation<Patchable>() }.map { it.name }.toSet()
            jsonNode.fieldNames().forEach { field ->
                if (field !in patchableProperties) {
                    throw BackendRequestException(
                        BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
                        "Unknown or unpatchable property $field",
                    )
                }
                val patchValue = jsonNode.get(field)
                (entityJson as ObjectNode).replace(field, patchValue)
            }
            return objectMapper.treeToValue(entityJson, kClass.java)
        } catch (e: Exception) {
            throw BackendRequestException(BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE, e.message)
        }
    }
}
