package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.utils

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestErrorCode
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestException

fun validateId(requestDataAsJson: String, idPropName: String, idFromRequestPath: Int, objectMapper: ObjectMapper) {
    val requestDataAsJsonNode = objectMapper.readTree(requestDataAsJson)
    val idAsJsonNode = requestDataAsJsonNode.get(idPropName)

    if (idAsJsonNode == null) {
        throw BackendRequestException(
            BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
            "`$idPropName` is missing in the request data.",
        )
    }

    if (idAsJsonNode.isNull) {
        throw BackendRequestException(
            BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
            "`$idPropName` is `null` in the request data.",
        )
    }

    if (!idAsJsonNode.isInt) {
        throw BackendRequestException(
            BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
            "`$idPropName` must be an integer in the request data.",
        )
    }

    val requestDataId = idAsJsonNode.asInt()
    if (requestDataId != idFromRequestPath) {
        throw BackendRequestException(
            BackendRequestErrorCode.BODY_ID_MISMATCH_REQUEST_PATH_ID,
            "Request data `$idPropName` ('$requestDataId') doesn't match the {$idPropName} in the request path ('$idFromRequestPath').",
        )
    }
}
