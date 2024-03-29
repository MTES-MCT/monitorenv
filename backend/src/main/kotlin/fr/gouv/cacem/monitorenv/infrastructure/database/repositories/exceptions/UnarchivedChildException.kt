package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions

/** Thrown when attempting to archive an entity linked to non-archived child(ren). */
class UnarchivedChildException(message: String) : RuntimeException(message)
