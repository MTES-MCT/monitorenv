package fr.gouv.cacem.monitorenv.domain.validators

interface Validator<T> {
    fun validate(obj: T)
}
