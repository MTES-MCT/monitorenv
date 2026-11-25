package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "user_authorizations")
data class UserAuthorizationModel(
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,
    @Column(name = "hashed_email", nullable = false)
    val hashedEmail: String,
    @Column(name = "is_super_user", nullable = false)
    val isSuperUser: Boolean,
) {
    fun toUserAuthorization() =
        UserAuthorization(
            id = id,
            hashedEmail = hashedEmail,
            isSuperUser = isSuperUser,
        )
}
