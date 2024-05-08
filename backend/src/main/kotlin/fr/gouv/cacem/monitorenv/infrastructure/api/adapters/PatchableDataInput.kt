package fr.gouv.cacem.monitorenv.infrastructure.api.adapters

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendInternalException
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestErrorCode
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestException
import kotlin.reflect.KClass
import kotlin.reflect.full.memberProperties
import kotlin.reflect.full.primaryConstructor

abstract class PatchableDataInput<T : PatchableDataInput<T>> {
    inline fun <reified T : PatchableDataInput<T>> patchFromRequestData(
        objectMapper: ObjectMapper,
        requestDataJson: String,
    ): T {
        val nextDataFromRequestAsJsonNode = objectMapper.readTree(requestDataJson)

        val constructor = T::class.primaryConstructor!!
        val params = constructor.parameters.associateWith { parameter ->
            val propType = T::class.memberProperties.find { it.name == parameter.name }
            val nextPropValueFromRequest = nextDataFromRequestAsJsonNode.get(parameter.name)

            if (nextPropValueFromRequest != null && !nextPropValueFromRequest.isMissingNode) {
                // A JSON value set to `null` won't set `maybeNextPropValueFromRequest` to `null`,
                // it's a valid value that `JsonNode` can check using `.isNull()` method.
                if (nextPropValueFromRequest.isNull) {
                    return@associateWith null
                }

                return@associateWith convertJsonValueToType(
                    nextPropValueFromRequest,
                    parameter.name
                        ?: throw BackendInternalException(
                            "${T::class.simpleName}: Property name not found.",
                        ),
                    propType?.returnType?.classifier as? KClass<*>
                        ?: throw BackendInternalException(
                            "${T::class.simpleName}: Type for `${parameter.name}` not found.",
                        ),
                    T::class.simpleName,
                )
            }

            return@associateWith propType?.getter?.call(this)
        }

        return constructor.callBy(params)
    }

    fun convertJsonValueToType(
        jsonNode: JsonNode,
        propName: String,
        propType: KClass<*>,
        dataInputClassName: String?,
    ): Any {
        return when (propType) {
            Boolean::class -> if (jsonNode.isBoolean) {
                jsonNode.asBoolean()
            } else {
                throw BackendRequestException(
                    BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
                    "$dataInputClassName: Property `$propName` is not of type `Boolean`.",
                )
            }

            Int::class -> if (jsonNode.canConvertToInt()) {
                jsonNode.asInt()
            } else {
                throw BackendRequestException(
                    BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
                    "$dataInputClassName: Property `$propName` is not of type `Int`.",
                )
            }

            String::class -> if (jsonNode.isTextual) {
                jsonNode.asText()
            } else {
                throw BackendRequestException(
                    BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
                    "$dataInputClassName: Property `$propName` is not of type `String`.",
                )
            }

            else -> throw BackendInternalException(
                "$dataInputClassName: Unsupported type `$propType` for property `$propName`.",
            )
        }
    }
}
