package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaVesselRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaVesselRepository: JpaVesselRepository

    @Test
    fun `findById should return the specified vessel by id `() {
        // Given
        val vesselId = 1

        // When
        val vessel = jpaVesselRepository.findVesselById(vesselId)

        // Then
        assertThat(vessel?.id).isEqualTo(1)
        assertThat(vessel?.shipId).isEqualTo(11)
        assertThat(vessel?.status).isEqualTo("D")
        assertThat(vessel?.category).isEqualTo("PRO")
        assertThat(vessel?.isBanned).isEqualTo(false)
        assertThat(vessel?.imo).isEqualTo("IMO1111")
        assertThat(vessel?.mmsi).isEqualTo("MMSI11111")
        assertThat(vessel?.immatriculation).isEqualTo("IMMAT111111")
        assertThat(vessel?.shipName).isEqualTo("SHIPNAME 1")
        assertThat(vessel?.flag).isEqualTo("DZA")
        assertThat(vessel?.portOfRegistry).isEqualTo("ALGER")
        assertThat(vessel?.professionalType).isEqualTo("Porte-conteneur")
        assertThat(vessel?.commercialName).isEqualTo("COMMERCIAL NAME")
        assertThat(vessel?.length).isEqualTo("12.12")
        assertThat(vessel?.ownerLastName).isEqualTo("DURAND")
        assertThat(vessel?.ownerFirstName).isEqualTo("MICHEL")
        assertThat(vessel?.ownerDateOfBirth).isEqualTo("1998-07-12")
        assertThat(vessel?.ownerPostalAddress).isEqualTo("82 STADE DE FRANCE")
        assertThat(vessel?.ownerPhone).isEqualTo("0102030405")
        assertThat(vessel?.ownerEmail).isEqualTo("email@gmail.com")
        assertThat(vessel?.ownerCompanyName).isEqualTo("COMPANY NAME 1")
        assertThat(vessel?.ownerNationality).isEqualTo("FRANCE")
        assertThat(vessel?.ownerBusinessSegment).isEqualTo("45.40Z")
        assertThat(vessel?.ownerLegalStatus).isEqualTo("3120")
        assertThat(vessel?.ownerStartDate).isEqualTo("2000-01-01")
    }

    @Test
    fun `findById should return null when the vessel with given id doesnt exist`() {
        // Given
        val vesselId = 9999

        // When
        val vessel = jpaVesselRepository.findVesselById(vesselId)

        // Then
        assertThat(vessel).isNull()
    }

    @Test
    fun `search should not return vessels that is banned`() {
        // Given
        val searched = "SHIPNAME 4"

        // When
        val vessels = jpaVesselRepository.search(searched)

        // Then
        assertThat(vessels).hasSize(0)
    }

    @Test
    fun `search should return vessels that match the search term (shipname)`() {
        // Given
        val searched = "hipnam"

        // When
        val vessels = jpaVesselRepository.search(searched)

        // Then
        assertThat(vessels).hasSize(3)
        assertThat(vessels).allMatch { it.shipName?.contains(searched, ignoreCase = true) == true }
    }

    @Test
    fun `search should return vessels that match the search term (imo)`() {
        // Given
        val searched = "iMo222"

        // When
        val vessels = jpaVesselRepository.search(searched)

        // Then
        assertThat(vessels).hasSize(3)
        assertThat(vessels).allMatch { it.imo?.contains(searched, ignoreCase = true) == true }
    }

    @Test
    fun `search should return vessels that match the search term (mmsi)`() {
        // Given
        val searched = "mMSi2222"

        // When
        val vessels = jpaVesselRepository.search(searched)

        // Then
        assertThat(vessels).hasSize(3)
        assertThat(vessels).allMatch { it.mmsi?.contains(searched, ignoreCase = true) == true }
    }

    @Test
    fun `search should return vessels that match the search term (immatriculation)`() {
        // Given
        val searched = "iMmaT22222"

        // When
        val vessels = jpaVesselRepository.search(searched)

        // Then
        assertThat(vessels).hasSize(3)
        assertThat(vessels).allMatch { it.immatriculation?.contains(searched, ignoreCase = true) == true }
    }
}
