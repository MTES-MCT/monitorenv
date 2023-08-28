package fr.gouv.cacem.monitorenv.utils

fun <T : Any> requireNotNullList(values: List<T?>?): List<T> {
    if (values == null) {
        throw IllegalArgumentException("This list is null.")
    }

    return values.map { requireNotNull(it) }
}
