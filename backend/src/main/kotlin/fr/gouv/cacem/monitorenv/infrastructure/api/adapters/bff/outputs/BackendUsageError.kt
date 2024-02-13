package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.ErrorCode

class BackendUsageError(val code: ErrorCode, val data: Any)
