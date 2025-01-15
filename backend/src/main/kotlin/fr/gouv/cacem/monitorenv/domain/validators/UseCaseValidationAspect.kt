package fr.gouv.cacem.monitorenv.domain.validators

import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.aspectj.lang.reflect.MethodSignature
import org.springframework.stereotype.Component

@Component
@Aspect
class UseCaseValidationAspect {
    @Before("execution(* fr.gouv.cacem.monitorenv.domain.use_cases..*.execute(..))")
    fun before(joinPoint: JoinPoint) {
        val method = (joinPoint.signature as MethodSignature).method

        // Parcourir les paramètres de la méthode
        method.parameters.forEachIndexed { index, parameter ->
            val annotation = parameter.getAnnotation(UseCaseValidation::class.java)
            if (annotation != null) {
                // Récupérer l'argument associé à ce paramètre
                val arg = joinPoint.args[index]

                // Instancier et exécuter le validateur spécifié dans l'annotation
                val validator =
                    annotation.validator.objectInstance
                        ?: annotation.validator.java.getDeclaredConstructor().newInstance()
                (validator as Validator<Any>).validate(arg) // Valide l'objet
            }
        }
    }
}
