package fr.gouv.cacem.monitorenv.utils

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

@DisplayName("utils/mapOrElseEmpty()")
class MapOrElseEmptyUTest {
    @Test
    fun `Should map the list as expected when the list is not null`() {
        data class Item(
            val name: String,
        )

        val items = listOf(Item("a"), Item("b"), Item("c"))

        assertEquals(listOf("a", "b", "c"), items.mapOrElseEmpty { it.name })
    }

    @Test
    fun `Should return an empty list when the list is null`() {
        data class Item(
            val name: String,
        )

        val items: List<Item>? = null

        assertTrue(items.mapOrElseEmpty { it.name }.isEmpty())
    }
}
