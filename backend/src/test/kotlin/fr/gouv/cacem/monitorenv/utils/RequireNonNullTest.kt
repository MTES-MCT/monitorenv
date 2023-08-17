package fr.gouv.cacem.monitorenv.utils

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName

@DisplayName("utils/requireNonNull()")
class RequireNonNullTest {
    @Test
    fun `Should return the value when it's not null`() {
        val value = 42

        assertEquals(value, requireNonNull(value))
    }

    @Test
    fun `Should throw an IllegalArgumentException when the value is null`() {
        val value = null

        assertThrows(IllegalArgumentException::class.java) {
            requireNonNull(value)
        }
    }
}
