import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.jlleitschuh.gradle.ktlint.KtlintExtension

plugins {
    `java-library`
    `maven-publish`
    id("org.springframework.boot") version "3.5.6"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.jlleitschuh.gradle.ktlint") version "12.3.0"
    kotlin("jvm") version "2.2.20"
    kotlin("plugin.spring") version "2.2.20"
    kotlin("plugin.allopen") version "2.2.20"
    kotlin("plugin.noarg") version "2.2.20"
    kotlin("plugin.jpa") version "2.2.20"
    kotlin("plugin.serialization") version "2.2.20"
}

repositories {
    mavenCentral()
}

group = "fr.gouv.cacem"
version = "VERSION_TO_CHANGE"
description = "MonitorEnv"
java.sourceCompatibility = JavaVersion.VERSION_21

kotlin {
    jvmToolchain(21)
}

java {
    withJavadocJar()
    withSourcesJar()
}

// https://github.com/JLLeitschuh/ktlint-gradle/issues/809
ktlint {
    version.set("1.4.1")
}

noArg {
    invokeInitializers = true
}

configurations.all {
    exclude(group = "org.springframework.boot", module = "spring-boot-starter-logging")
}

tasks.withType<KotlinCompile> {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_21)
        freeCompilerArgs.set(listOf("-Xjsr305=strict"))
    }
}

val ktorVersion = "3.3.0"
val testcontainersVersion = "1.21.3"
val sentryVersion = "8.23.0"
val flywayVersion = "11.13.2"

dependencies {
    implementation(platform("org.springframework.boot:spring-boot-dependencies:3.5.6"))

    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-cache")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-log4j2")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.security:spring-security-oauth2-resource-server")
    implementation("org.springframework.security:spring-security-oauth2-jose")
    implementation("org.springframework.boot:spring-boot-configuration-processor")

    // Database & Migration
    implementation("org.postgresql:postgresql")
    implementation("org.flywaydb:flyway-core:$flywayVersion")
    implementation("org.flywaydb:flyway-database-postgresql:$flywayVersion")
    implementation("org.hibernate.orm:hibernate-spatial:7.1.3.Final")
    implementation("org.hibernate.validator:hibernate-validator:9.0.1.Final")
    implementation("io.hypersistence:hypersistence-utils-hibernate-63:3.11.0")

    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")

    // Jackson
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.20.0")
    implementation("org.n52.jackson:jackson-datatype-jts:2.0.0")

    // HTTP Clients (Ktor)
    implementation("io.ktor:ktor-client-core:$ktorVersion")
    implementation("io.ktor:ktor-client-java:$ktorVersion")
    implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")

    // Monitoring & Logging
    implementation("io.sentry:sentry:$sentryVersion")
    implementation("io.sentry:sentry-log4j2:$sentryVersion")

    // Cache
    implementation("com.github.ben-manes.caffeine:caffeine:3.2.2")

    // API Documentation
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.13")

    // JodConverter
    implementation("org.jodconverter:jodconverter-local-lo:4.4.11")
    // the two following apoche poi dependencies should have the same version
    implementation("org.apache.poi:poi:5.4.1")
    implementation("org.apache.poi:poi-ooxml:5.4.1")
    // Scalr (image resizer with better quality)
    implementation("org.imgscalr:imgscalr-lib:4.2")

    // SVG
    implementation("org.apache.xmlgraphics:batik-transcoder:1.19")
    implementation("org.apache.xmlgraphics:batik-codec:1.19")

    // Devtools
    runtimeOnly("org.springframework.boot:spring-boot-devtools")

    // Testing
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc:3.0.5")
    testImplementation("org.assertj:assertj-core:3.27.6")
    testImplementation("org.testcontainers:testcontainers:$testcontainersVersion")
    testImplementation("org.testcontainers:postgresql:$testcontainersVersion")
    testImplementation("org.testcontainers:junit-jupiter:$testcontainersVersion")
    testImplementation("io.ktor:ktor-client-mock:$ktorVersion")
    testImplementation("jakarta.servlet:jakarta.servlet-api:6.1.0")
    testImplementation("com.squareup.okhttp3:mockwebserver:5.1.0")
    testImplementation("net.ttddyy:datasource-proxy:1.11.0")
    testImplementation("io.mockk:mockk:1.14.6")
    testImplementation("com.nhaarman.mockitokotlin2:mockito-kotlin:2.2.0")
}

springBoot {
    mainClass.set("fr.gouv.cacem.monitorenv.MonitorEnvApplicationKt")

    buildInfo {
        properties {
            additional =
                mapOf(
                    "commit.hash" to "COMMIT_TO_CHANGE",
                )
        }
    }
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}

tasks.withType<Javadoc> {
    options.encoding = "UTF-8"
}

configure<KtlintExtension> {
    verbose.set(true)
    android.set(false)
    outputToConsole.set(true)
    ignoreFailures.set(true)
}

tasks.named<Test>("test") {
    useJUnitPlatform()

    testLogging {
        events("passed")
    }
}
