package fr.gouv.cacem.monitorenv.domain.exceptions

import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.ErrorCode

class BackendUsageException(val code: ErrorCode, val data: Any) : Throwable(code.name)
