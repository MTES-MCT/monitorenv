package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendRequestErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendRequestException

abstract class BaseController(open val objectMapper: ObjectMapper) {
    protected fun validateId(requestDataAsJson: String, idPropName: String, idFromRequestPath: Int) {
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
                BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE,
                "Request data `$idPropName` ('$requestDataId') doesn't match the {$idPropName} in the request path ('$idFromRequestPath').",
            )
        }
    }
}
