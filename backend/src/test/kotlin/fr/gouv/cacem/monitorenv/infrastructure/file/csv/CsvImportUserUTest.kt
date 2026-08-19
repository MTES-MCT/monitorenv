package fr.gouv.cacem.monitorenv.infrastructure.file.csv

import fr.gouv.cacem.monitorenv.domain.hash
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.mock.web.MockMultipartFile

class CsvImportUserUTest {
    private val csvImportUser = CsvImportUser()

    @Test
    fun `parse should return one UserAuthorization per record`() {
        val csv =
            """
            MEL
            alice@example.com
            bob@example.com
            """.trimIndent()
        val multipartFile =
            MockMultipartFile(
                "file",
                "users.csv",
                "text/csv",
                csv.toByteArray(Charsets.UTF_8),
            )
        val result = csvImportUser.parse(multipartFile, false)

        assertThat(result).hasSize(2)
        assertThat(result.map { it.hashedEmail }).containsExactly(
            hash("alice@example.com"),
            hash("bob@example.com"),
        )
    }

    @Test
    fun `parse should set isSuperUser to every UserAuthorization`() {
        val csv =
            """
            MEL
            alice@example.com
            """.trimIndent()
        val multipartFile =
            MockMultipartFile(
                "file",
                "users.csv",
                "text/csv",
                csv.toByteArray(Charsets.UTF_8),
            )
        val resultAsSuperUser = csvImportUser.parse(multipartFile, true)
        val resultAsRegularUser = csvImportUser.parse(multipartFile, false)

        assertThat(resultAsSuperUser.single().isSuperUser).isTrue()
        assertThat(resultAsRegularUser.single().isSuperUser).isFalse()
    }

    @Test
    fun `parse should skip rows with a blank MEL value and keep the valid ones`() {
        val csv =
            """
            MEL|NOM
            alice@example.com|Alice
            |Dupont
            bob@example.com|Bob
            """.trimIndent()
        val multipartFile =
            MockMultipartFile(
                "file",
                "users.csv",
                "text/csv",
                csv.toByteArray(Charsets.UTF_8),
            )
        val result = csvImportUser.parse(multipartFile, false)

        assertThat(result).hasSize(2)
        assertThat(result.map { it.hashedEmail }).containsExactly(
            hash("alice@example.com"),
            hash("bob@example.com"),
        )
    }

    @Test
    fun `parse should return an empty list when CSV only has headers`() {
        val csv = "MEL"
        val multipartFile =
            MockMultipartFile(
                "file",
                "users.csv",
                "text/csv",
                csv.toByteArray(Charsets.UTF_8),
            )
        val result = csvImportUser.parse(multipartFile, false)

        assertThat(result).isEmpty()
    }

    @Test
    fun `parse should trim whitespace around email values`() {
        val csv =
            """
            MEL
             alice@example.com 
            """.trimIndent()
        val multipartFile =
            MockMultipartFile(
                "file",
                "users.csv",
                "text/csv",
                csv.toByteArray(Charsets.UTF_8),
            )
        val result = csvImportUser.parse(multipartFile, false)

        assertThat(result.single().hashedEmail).isEqualTo(hash("alice@example.com"))
    }

    @Test
    fun `parse should throw when the MEL column is entirely missing from the CSV`() {
        val csv =
            """
            EMAIL
            alice@example.com
            """.trimIndent()
        val multipartFile =
            MockMultipartFile(
                "file",
                "users.csv",
                "text/csv",
                csv.toByteArray(Charsets.UTF_8),
            )
        assertThrows<IllegalArgumentException> {
            csvImportUser.parse(multipartFile, false)
        }
    }
}
