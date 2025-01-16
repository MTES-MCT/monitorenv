package fr.gouv.cacem.monitorenv.domain.validators

fun interface Validator<T> {
    fun validate(obj: T)
}
