package fr.gouv.cacem.monitorenv.utils

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName

@DisplayName("utils/requireNotNullList()")
class RequireNotNullListUTest {
    @Test
    fun `Should return the values when it's not null and the list doesn't contain any null value`() {
        val values = listOf<Int>(42, 43)

        assertEquals(values, requireNotNullList(values))
    }

    @Test
    fun `Should throw an IllegalArgumentException when the values list is null`() {
        val values: List<Int>? = null

        assertThrows(IllegalArgumentException::class.java) {
            requireNotNullList(values)
        }
    }

    @Test
    fun `Should throw an IllegalArgumentException when the values list contains a null value`() {
        val values = listOf<Int?>(42, null)

        assertThrows(IllegalArgumentException::class.java) {
            requireNotNullList(values)
        }
    }
}
