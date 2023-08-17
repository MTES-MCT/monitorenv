package fr.gouv.cacem.monitorenv.domain.exceptions

class NotFoundException(message: String, cause: Throwable? = null) :
    Throwable(message, cause)
