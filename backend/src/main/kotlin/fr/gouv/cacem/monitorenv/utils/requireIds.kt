package fr.gouv.cacem.monitorenv.utils

fun <T : Any> requireIds(
    items: List<T>?,
    idSelector: (T) -> Int?,
): List<Int> {
    if (items == null) {
        throw IllegalArgumentException("This collection is null.")
    }

    return items.map { requireNotNull(idSelector(it)) }
}
