package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant

@Entity
@Table(name = "bases")
data class StationModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "station")
    @JsonManagedReference
    val controlUnitResources: List<ControlUnitResourceModel> = listOf(),
    @Column(name = "latitude", nullable = false)
    val latitude: Double,
    @Column(name = "longitude", nullable = false)
    val longitude: Double,
    @Column(name = "name", nullable = false, unique = true)
    val name: String,
    @Column(name = "created_at_utc", nullable = false, updatable = false)
    @CreationTimestamp
    val createdAtUtc: Instant? = null,
    @Column(name = "updated_at_utc", nullable = false)
    @UpdateTimestamp
    val updatedAtUtc: Instant? = null,
) {
    companion object {
        /**
         * @param controlUnitResourceModels Return control unit resources relations when provided.
         */
        fun fromStation(
            station: StationEntity,
            controlUnitResourceModels: List<ControlUnitResourceModel>? = null,
        ): StationModel {
            return StationModel(
                id = station.id,
                controlUnitResources = controlUnitResourceModels ?: listOf(),
                latitude = station.latitude,
                longitude = station.longitude,
                name = station.name,
            )
        }
    }

    fun toStation(): StationEntity {
        return StationEntity(
            id,
            latitude,
            longitude,
            name,
        )
    }

    fun toFullStation(): FullStationDTO {
        val controlUnitResourceModels = controlUnitResources

        return FullStationDTO(
            station = toStation(),
            controlUnitResources = controlUnitResourceModels.map { it.toControlUnitResource() }.sortedBy { it.id },
        )
    }

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(id = $id , latitude = $latitude , longitude = $longitude , name = $name)"
    }
}
