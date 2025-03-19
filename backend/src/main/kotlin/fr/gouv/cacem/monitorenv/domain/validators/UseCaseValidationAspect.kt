package fr.gouv.cacem.monitorenv.domain.validators

import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.aspectj.lang.reflect.MethodSignature
import org.springframework.context.ApplicationContext
import org.springframework.stereotype.Component

@Component
@Aspect
class UseCaseValidationAspect(
    private val applicationContext: ApplicationContext,
) {
    @Before("execution(* fr.gouv.cacem.monitorenv.domain.use_cases..*.execute(..))")
    fun before(joinPoint: JoinPoint) {
        val method = (joinPoint.signature as MethodSignature).method

        method.parameters.forEachIndexed { index, parameter ->
            val annotation = parameter.getAnnotation(UseCaseValidation::class.java)
            if (annotation != null) {
                val arg = joinPoint.args[index]

                // Récupérer le validateur depuis le contexte Spring
                val validator = applicationContext.getBean(annotation.validator.java) as Validator<Any>
                validator.validate(arg)
            }
        }
    }
}
