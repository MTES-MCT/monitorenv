package fr.gouv.cacem.monitorenv.infrastructure.database.model

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "naf")
data class NafModel(
    @Id
    val code: String,
    val label: String,
)
