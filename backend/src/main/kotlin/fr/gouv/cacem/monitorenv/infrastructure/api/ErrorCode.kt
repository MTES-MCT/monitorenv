package fr.gouv.cacem.monitorenv.infrastructure.api

// Don't forget to mirror any update here in the frontend enum.
enum class ErrorCode {
    FOREIGN_KEY_CONSTRAINT,

    /** Thrown when attempting to archive an entity linked to non-archived child(ren). */
    UNARCHIVED_CHILD
}
