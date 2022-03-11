package fr.gouv.cacem.monitorenv.domain.exceptions

class CouldNotUpdateOperationException(message: String, cause: Throwable? = null) :
        Throwable(message, cause)