package fr.gouv.cacem.monitorenv.utils

fun <T, R> List<T>?.mapOrElseEmpty(transform: (T) -> R): List<R> = this?.map(transform) ?: listOf()
