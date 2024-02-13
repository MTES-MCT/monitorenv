package fr.gouv.cacem.monitorenv.domain.exceptions

import fr.gouv.cacem.monitorenv.domain.entities.ErrorCode

class BackendUsageException(val code: ErrorCode, val data: Any) : Throwable(code.name)
