package fr.gouv.cacem.monitorenv.domain.exceptions

class CodeNotFoundException(message: String, cause: Throwable? = null) :
    Throwable(message, cause)
