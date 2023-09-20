package fr.gouv.cacem.monitorenv.utils

fun <T : Any> requireNotNullList(values: List<T?>?): List<T> {
    return requireNotNull(values).map { requireNotNull(it) }
}
