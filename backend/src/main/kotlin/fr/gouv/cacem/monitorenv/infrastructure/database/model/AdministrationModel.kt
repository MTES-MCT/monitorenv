package fr.gouv.cacem.monitorenv.infrastructure.database.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "administrations")
data class AdministrationModel(
    @Id
    @Column(name = "id")
    var id: Int? = null,
    @Column(name = "name")
    var name: String,
)
