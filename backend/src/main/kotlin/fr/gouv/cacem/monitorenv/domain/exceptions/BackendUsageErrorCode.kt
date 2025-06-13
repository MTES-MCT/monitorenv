package fr.gouv.cacem.monitorenv.domain.exceptions

/**
 * Error code thrown when the request is valid but the backend cannot process it.
 *
 * It's called "usage" because this request likely comes from an end-user action that's no longer valid
 * which happens when their client data is not up-to-date with the backend.
 *
 * But it can also be a Frontend side bug.
 *
 * ## Examples
 * - A user tries to create a resource that has already been created.
 * - A user tries to delete a resource that doesn't exist anymore.
 *
 * ## Logging
 * The related exception is NOT logged on the Backend side.
 * It should be logged on the Frontend side IF it's unexpected (= Frontend bug),
 * it should rather display a comprehensible error message to the end-user.
 *
 * ### ⚠️ Important
 * **Don't forget to mirror any update here in the corresponding Frontend enum.**
 */
enum class BackendUsageErrorCode {
    /** Thrown when attempting to attach a mission to a reporting that has already a mission attached. */
    CHILD_ALREADY_ATTACHED,

    /** Thrown when attempting to archive an entity linked to non-archived child(ren). */
    UNARCHIVED_CHILD,

    /** Thrown when attempting to delete a mission that has actions created by other applications. */
    EXISTING_MISSION_ACTION,

    /** Thrown when attempting to find an entity that has does not exist. */
    ENTITY_NOT_FOUND,

    /** Thrown when an entity contain an unvalid property. */
    UNVALID_PROPERTY,

    /** Thrown when an entity could not be saved. */
    ENTITY_NOT_SAVED,

    /** Thrown when an entity could not be deleted. */
    CANNOT_DELETE_ENTITY,
}
