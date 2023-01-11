package fr.gouv.cacem.monitorenv.infrastructure.database.model

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "administrations")
data class AdministrationModel(
    @Id
    @Column(name = "id")
    var id: Int? = null,
    @Column(name = "name")
    var name: String
)
