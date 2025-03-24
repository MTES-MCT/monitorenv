package fr.gouv.cacem.monitorenv.utils

fun <T : Any> requireNotNullList(values: List<T?>?): List<T> =
        requireNotNull(values).map { requireNotNull(it) }
