package fr.gouv.cacem.monitorenv.utils

fun <T : Any> requireNonNullList(values: List<T?>?): List<T> {
    if (values == null) {
        throw IllegalArgumentException("This values list is null.")
    }

    return values.map { requireNonNull(it) }
}
