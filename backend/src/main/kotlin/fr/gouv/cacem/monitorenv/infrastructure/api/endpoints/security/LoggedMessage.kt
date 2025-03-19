package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.security

class LoggedMessage(
    private val message: String,
    private val email: String,
    val url: String,
) {
    override fun toString(): String =
        """
        {
            "message": "$message",
            "email": "$email",
            "URL": "$url"
        }
        """.trimIndent()
}
