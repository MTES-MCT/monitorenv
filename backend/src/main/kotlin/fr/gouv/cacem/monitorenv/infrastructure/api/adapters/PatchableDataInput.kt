package fr.gouv.cacem.monitorenv.infrastructure.api.adapters

import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import tools.jackson.databind.JsonNode
import tools.jackson.databind.json.JsonMapper
import kotlin.reflect.KClass
import kotlin.reflect.full.memberProperties
import kotlin.reflect.full.primaryConstructor

abstract class PatchableDataInput<T : PatchableDataInput<T>>(
    private val clazz: KClass<T>,
) {
    fun patchFromRequestData(
        jsonMapper: JsonMapper,
        requestDataJson: String,
    ): T {
        val nextDataFromRequestAsJsonNode = jsonMapper.readTree(requestDataJson)

        val constructor = clazz.primaryConstructor!!
        val params =
            constructor.parameters.associateWith { parameter ->
                val propType = clazz.memberProperties.find { it.name == parameter.name }
                val nextPropValueFromRequest = nextDataFromRequestAsJsonNode.get(parameter.name)

                // - If the JSON property is absent, `JsonNode.get()` returns `null`.
                // - If the JSON property is explicitly set to `null`, `JsonNode.isNull()` returns `true`.
                if (nextPropValueFromRequest != null) {
                    if (nextPropValueFromRequest.isNull) {
                        return@associateWith null
                    }

                    return@associateWith convertJsonValueToType(
                        nextPropValueFromRequest,
                        parameter.name
                            ?: throw BackendUsageException(
                                BackendUsageErrorCode.UNVALID_PROPERTY,
                                "${this::class.simpleName}: Property name not found.",
                                parameter.name,
                            ),
                        propType?.returnType?.classifier as? KClass<*>
                            ?: throw BackendUsageException(
                                BackendUsageErrorCode.UNVALID_PROPERTY,
                                "${this::class.simpleName}: Type for `${parameter.name}` not found.",
                                parameter.name,
                            ),
                    )
                }

                return@associateWith propType?.getter?.call(this)
            }

        return constructor.callBy(params)
    }

    private fun convertJsonValueToType(
        jsonNode: JsonNode,
        propName: String,
        propType: KClass<*>,
    ): Any =
        when (propType) {
            Boolean::class ->
                if (jsonNode.isBoolean) {
                    jsonNode.asBoolean()
                } else {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "${this::class.simpleName}: Property `$propName` is not of type `Boolean`.",
                        propName,
                    )
                }

            Int::class ->
                if (jsonNode.canConvertToInt()) {
                    jsonNode.asInt()
                } else {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "${this::class.simpleName}: Property `$propName` is not of type `Int`.",
                        propName,
                    )
                }

            String::class ->
                if (jsonNode.isTextual) {
                    jsonNode.asText()
                } else {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "${this::class.simpleName}: Property `$propName` is not of type `String`.",
                        propName,
                    )
                }

            else -> throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "${this::class.simpleName}: Unsupported type `$propType` for property `$propName`.",
                propName,
            )
        }
}
