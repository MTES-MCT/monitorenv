package fr.gouv.cacem.monitorenv

import com.tngtech.archunit.core.domain.JavaClasses
import com.tngtech.archunit.core.importer.ImportOption
import com.tngtech.archunit.junit.AnalyzeClasses
import com.tngtech.archunit.junit.ArchTest
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses

private const val DOMAIN_PACKAGE = "..domain.."
private const val DOMAIN_ENTITIES_PACKAGE = "..domain.entities.."
private const val DOMAIN_REPOSITORIES_PACKAGE = "..domain.repositories.."
private const val DOMAIN_USE_CASES_PACKAGE = "..domain.use_cases.."

private val UNAUTHORIZED_PACKAGES_IN_DOMAIN = listOf(
    "infrastructure",
    "org.springframework",
    "jakarta",
)

@AnalyzeClasses(packages = ["fr.gouv.cacem.monitorenv"], importOptions = [ImportOption.DoNotIncludeTests::class])
class LayeredArchitectureTest {

    @ArchTest
    fun `domain entities and repositories should not use unauthorized packages`(importedClasses: JavaClasses) {
        UNAUTHORIZED_PACKAGES_IN_DOMAIN.forEach { packageName ->
            noClasses()
                .that().resideInAnyPackage(DOMAIN_ENTITIES_PACKAGE, DOMAIN_REPOSITORIES_PACKAGE)
                .should().dependOnClassesThat().resideInAPackage("..$packageName..")
                .check(importedClasses)
        }
    }

    @ArchTest
    fun `domain use cases should not use unauthorized packages`(importedClasses: JavaClasses) {
        UNAUTHORIZED_PACKAGES_IN_DOMAIN.forEach { packageName ->
            noClasses()
                .that().resideInAnyPackage(DOMAIN_USE_CASES_PACKAGE)
                .should().dependOnClassesThat().resideInAPackage("..$packageName..")
                .check(importedClasses)
        }
    }
}
