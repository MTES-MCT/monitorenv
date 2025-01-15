package fr.gouv.cacem.monitorenv.domain.validators

import kotlin.reflect.KClass

@Target(AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
annotation class UseCaseValidation<T>(
    val validator: KClass<out Validator<T>>,
)
