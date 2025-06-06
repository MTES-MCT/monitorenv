package fr.gouv.cacem.monitorenv.domain.validators.vigilance_area

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures.VigilanceAreaFixture.Companion.aVigilanceAreaEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.NullSource
import org.junit.jupiter.params.provider.ValueSource

class VigilanceAreaValidatorUTest {
    private val vigilanceAreaValidator = VigilanceAreaValidator()

    @ParameterizedTest
    @ValueSource(strings = ["A", "AA", "AAAA"])
    fun `validate should throw an exception if createdBy is not a trigram when it is published`(createdBy: String) {
        val vigilanceArea = aVigilanceAreaEntity(createdBy = createdBy, isDraft = false)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { vigilanceAreaValidator.validate(vigilanceArea) }
        assertThat(assertThrows.message).isEqualTo("Le trigramme \"créé par\" doit avoir 3 lettres")
    }

    @Test
    fun `validate should throw an exception if tags and themes are empty when it is published`() {
        val vigilanceArea = aVigilanceAreaEntity(tags = listOf(), themes = listOf(), isDraft = false)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { vigilanceAreaValidator.validate(vigilanceArea) }
        assertThat(assertThrows.message).isEqualTo("Un tag ou un thème est obligatoire")
    }

    @Test
    fun `validate should throw an exception if startDate is null when it is published`() {
        val vigilanceArea = aVigilanceAreaEntity(startDate = null, isDraft = false)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { vigilanceAreaValidator.validate(vigilanceArea) }
        assertThat(assertThrows.message).isEqualTo("La date de début est obligatoire")
    }

    @Test
    fun `validate should throw an exception if endDate is null when it is published`() {
        val vigilanceArea = aVigilanceAreaEntity(endDate = null, isDraft = false)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { vigilanceAreaValidator.validate(vigilanceArea) }
        assertThat(assertThrows.message).isEqualTo("La date de fin est obligatoire")
    }

    @Test
    fun `validate should throw an exception if frequency is null when it is published`() {
        val vigilanceArea = aVigilanceAreaEntity(frequency = null, isDraft = false)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { vigilanceAreaValidator.validate(vigilanceArea) }
        assertThat(assertThrows.message).isEqualTo("La fréquence est obligatoire")
    }

    @Test
    fun `validate should throw an exception if endingCondition is END_DATE and endingOccurenceDate is null when it is published`() {
        val vigilanceArea =
            aVigilanceAreaEntity(
                endCondition = EndingConditionEnum.END_DATE,
                endingOccurenceDate = null,
                isDraft = false,
            )

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { vigilanceAreaValidator.validate(vigilanceArea) }
        assertThat(assertThrows.message).isEqualTo("La date de fin de l'occurence est obligatoire")
    }

    @ParameterizedTest
    @ValueSource(ints = [0])
    @NullSource
    fun `validate should throw an exception if endingCondition is OCCURENCES_NUMBER and endingOccurrencesNumber is null or zero when it is published`(
        endingOccurrencesNumber: Int?,
    ) {
        val vigilanceArea =
            aVigilanceAreaEntity(
                endCondition = EndingConditionEnum.OCCURENCES_NUMBER,
                endingOccurrencesNumber = endingOccurrencesNumber,
                isDraft = false,
            )

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { vigilanceAreaValidator.validate(vigilanceArea) }
        assertThat(assertThrows.message).isEqualTo("Le nombre d'occurence est obligatoire")
    }

    @Test
    fun `validate should throw an exception if geometry is null when it is published`() {
        val vigilanceArea = aVigilanceAreaEntity(geom = null, isDraft = false)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { vigilanceAreaValidator.validate(vigilanceArea) }
        assertThat(assertThrows.message).isEqualTo("La géométrie est obligatoire")
    }

    @Test
    fun `validate should throw an exception if comments are null when it is published`() {
        val vigilanceArea = aVigilanceAreaEntity(comments = null, isDraft = false)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { vigilanceAreaValidator.validate(vigilanceArea) }
        assertThat(assertThrows.message).isEqualTo("Un commentaire est obligatoire")
    }

    @Test
    fun `validate should throw an exception if frequency is null when it is published and it is not limitless`() {
        val vigilanceArea = aVigilanceAreaEntity(frequency = null, isDraft = false)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { vigilanceAreaValidator.validate(vigilanceArea) }
        assertThat(assertThrows.message).isEqualTo("La fréquence est obligatoire")
    }

    @Test
    fun `validate should pass if the vigilance area is limitless`() {
        val vigilanceArea =
            aVigilanceAreaEntity(
                startDate = null,
                endDate = null,
                endingOccurenceDate = null,
                endingOccurrencesNumber = 0,
                isAtAllTimes = true,
                endCondition = EndingConditionEnum.END_DATE,
            )

        vigilanceAreaValidator.validate(vigilanceArea)
    }

    @Test
    fun `validate should pass if the vigilance area is draft`() {
        val vigilanceArea =
            aVigilanceAreaEntity(
                isDraft = true,
                startDate = null,
                endDate = null,
                endingOccurenceDate = null,
                endingOccurrencesNumber = 0,
                isAtAllTimes = false,
                endCondition = EndingConditionEnum.END_DATE,
            )

        vigilanceAreaValidator.validate(vigilanceArea)
    }

    @Test
    fun `validate should pass for a valid VigilanceAreaEntity`() {
        val vigilanceArea = aVigilanceAreaEntity()

        vigilanceAreaValidator.validate(vigilanceArea)
    }
}
