package fr.gouv.cacem.monitorenv.infrastructure.database.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "legal_status")
data class LegalStatusModel(
    @Id
    @Column(nullable = false, unique = true)
    val code: String,
    @Column(nullable = false)
    val label: String?,
)
