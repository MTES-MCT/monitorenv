package fr.gouv.cacem.monitorenv

import com.tngtech.archunit.core.domain.JavaClasses
import com.tngtech.archunit.core.importer.ImportOption
import com.tngtech.archunit.junit.AnalyzeClasses
import com.tngtech.archunit.junit.ArchTest
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses
import com.tngtech.archunit.library.Architectures.layeredArchitecture

private const val DOMAIN = "Domain"
private const val DOMAIN_PACKAGE = "..domain.."
private const val API = "API"
private const val API_PACKAGE = "..api.."
private const val DATABASE = "Database"
private const val DATABASE_PACKAGE = "..database.."
private const val JAKARTA_PACKAGE = "..jakarta.."
private const val SPRING_PACKAGE = "org.springframework.."

@AnalyzeClasses(packages = ["fr.gouv.cacem.monitorenv"], importOptions = [ImportOption.DoNotIncludeTests::class])
class LayeredArchitectureTest {

    @ArchTest
    fun `classes in domain layer should use Spring framework`(importedClasses: JavaClasses) {
        layeredArchitecture().consideringAllDependencies().layer(DOMAIN).definedBy(DOMAIN_PACKAGE)
            .layer(API).definedBy(API_PACKAGE).layer(DATABASE).definedBy(DATABASE_PACKAGE)
            .whereLayer(DOMAIN).mayOnlyBeAccessedByLayers(API)
            .whereLayer(API).mayNotBeAccessedByAnyLayer()
            .whereLayer(DATABASE).mayOnlyAccessLayers(DOMAIN).check(importedClasses)
    }

    @ArchTest
    fun `no classes in domain layer should not use Spring framework`(importedClasses: JavaClasses) {
        noClasses()
            .that().resideInAPackage(DOMAIN_PACKAGE)
            .should().dependOnClassesThat().resideInAnyPackage(SPRING_PACKAGE)
            .check(importedClasses)
    }
}
