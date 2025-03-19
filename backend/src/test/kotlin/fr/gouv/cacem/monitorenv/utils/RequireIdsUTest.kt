package fr.gouv.cacem.monitorenv.utils

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

@DisplayName("utils/requireIds()")
class RequireIdsUTest {
    @Test
    fun `Should return the collection IDs when none of them is null`() {
        data class Item(
            val id: Int?,
        )

        val items = listOf(Item(1), Item(2), Item(3))
        val expectedIds = listOf(1, 2, 3)

        assertEquals(expectedIds, requireIds(items) { it.id })
    }

    @Test
    fun `Should throw an IllegalArgumentException when any of the collection IDs is null`() {
        data class Item(
            val id: Int?,
        )

        val items = listOf(Item(1), Item(null), Item(3))

        assertThrows(IllegalArgumentException::class.java) {
            requireIds(items) { it.id }
        }
    }
}
