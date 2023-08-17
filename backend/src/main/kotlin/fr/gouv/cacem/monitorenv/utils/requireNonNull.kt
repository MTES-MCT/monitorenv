package fr.gouv.cacem.monitorenv.utils

fun <T : Any> requireNonNull(value: T?): T {
    return value ?: throw IllegalArgumentException("This value is unexpectedly null.")
}
