package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.UserAuthorizationModel
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface IDBUserAuthorizationRepository : CrudRepository<UserAuthorizationModel, String> {
    fun findByHashedEmail(hashedEmail: String): UserAuthorizationModel?

    @Modifying
    @Query(
        value = """
            INSERT INTO user_authorizations (id, hashed_email, is_super_user)
            VALUES (gen_random_uuid(), :hashedEmail, :isSuperUser)
            ON CONFLICT (hashed_email)
            DO UPDATE SET is_super_user = EXCLUDED.is_super_user
        """,
        nativeQuery = true,
    )
    fun upsert(
        hashedEmail: String,
        isSuperUser: Boolean,
    )
}
