package fr.gouv.cacem.monitorenv.infrastructure.api.adapters

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendInternalException
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendRequestErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendRequestException
import kotlin.reflect.KClass
import kotlin.reflect.full.memberProperties
import kotlin.reflect.full.primaryConstructor

abstract class PatchableDataInput<T : PatchableDataInput<T>>(private val clazz: KClass<T>) {
    fun patchFromRequestData(
        objectMapper: ObjectMapper,
        requestDataJson: String,
    ): T {
        val nextDataFromRequestAsJsonNode = objectMapper.readTree(requestDataJson)

        val constructor = clazz.primaryConstructor!!
        val params = constructor.parameters.associateWith { parameter ->
            val propType = clazz.memberProperties.find { it.name == parameter.name }
            val maybeNextPropValueFromRequest = nextDataFromRequestAsJsonNode.get(parameter.name)

            if (maybeNextPropValueFromRequest != null && !maybeNextPropValueFromRequest.isMissingNode) {
                // A JSON value set to `null` won't set `maybeNextPropValueFromRequest` to `null`,
                // it's a valid value that `JsonNode` can check using `.isNull()` method.
                if (maybeNextPropValueFromRequest.isNull) {
                    return@associateWith null
                }

                return@associateWith convertJsonValueToType(
                    maybeNextPropValueFromRequest,
                    parameter.name
                        ?: throw BackendInternalException(
                            "${this::class.simpleName}: Property name not found.",
                        ),
                    propType?.returnType?.classifier as? KClass<*>
                        ?: throw BackendInternalException(
                            "${this::class.simpleName}: Type for `${parameter.name}` not found.",
                        ),
                )
            }

            return@associateWith propType?.getter?.call(this)
        }

        return constructor.callBy(params)
    }

    private fun convertJsonValueToType(jsonNode: JsonNode, propName: String, propType: KClass<*>): Any {
        return when (propType) {
            Boolean::class -> if (jsonNode.isBoolean) {
                jsonNode.asBoolean()
            } else {
                throw BackendRequestException(
                    BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
                    "${this::class.simpleName}: Property `$propName` is not of type `Boolean`.",
                )
            }

            Int::class -> if (jsonNode.canConvertToInt()) {
                jsonNode.asInt()
            } else {
                throw BackendRequestException(
                    BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
                    "${this::class.simpleName}: Property `$propName` is not of type `Int`.",
                )
            }

            String::class -> if (jsonNode.isTextual) {
                jsonNode.asText()
            } else {
                throw BackendRequestException(
                    BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
                    "${this::class.simpleName}: Property `$propName` is not of type `String`.",
                )
            }

            else -> throw BackendInternalException(
                "${this::class.simpleName}: Unsupported type `$propType` for property `$propName`.",
            )
        }
    }
}
