package fr.gouv.cacem.monitorenv.infrastructure.api.utils

import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import tools.jackson.databind.json.JsonMapper

fun validateId(
    requestDataAsJson: String,
    idPropName: String,
    idFromRequestPath: Int,
    jsonMapper: JsonMapper,
) {
    val requestDataAsJsonNode = jsonMapper.readTree(requestDataAsJson)
    val idAsJsonNode = requestDataAsJsonNode.get(idPropName)

    if (idAsJsonNode == null) {
        throw BackendUsageException(
            BackendUsageErrorCode.UNVALID_PROPERTY,
            "`$idPropName` is missing in the request data.",
        )
    }

    if (idAsJsonNode.isNull) {
        throw BackendUsageException(
            BackendUsageErrorCode.UNVALID_PROPERTY,
            "`$idPropName` is `null` in the request data.",
        )
    }

    if (!idAsJsonNode.isInt) {
        throw BackendUsageException(
            BackendUsageErrorCode.UNVALID_PROPERTY,
            "`$idPropName` must be an integer in the request data.",
        )
    }

    val requestDataId = idAsJsonNode.asInt()
    if (requestDataId != idFromRequestPath) {
        throw BackendUsageException(
            BackendUsageErrorCode.UNVALID_PROPERTY,
            "Request data `$idPropName` ('$requestDataId') doesn't match the {$idPropName} in the request path ('$idFromRequestPath').",
        )
    }
}
