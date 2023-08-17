package fr.gouv.cacem.monitorenv.utils

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import java.util.Optional

@DisplayName("utils/_root_ide_package_.fr.gouv.cacem.monitorenv.utils.requirePresent()")
class RequirePresentTest {
    @Test
    fun `Should return the value from the Optional value when it's present`() {
        val value = 42
        val optionalValue = Optional.of(value)

        assertEquals(value, requirePresent(optionalValue))
    }

    @Test
    fun `Should throw an IllegalArgumentException when the Optional value is empty`() {
        val optionalValue = Optional.empty<Any>()

        assertThrows(IllegalArgumentException::class.java) {
            requirePresent(optionalValue)
        }
    }
}
