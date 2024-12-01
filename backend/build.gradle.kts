plugins {
    `java-library`
    `maven-publish`
    id("org.springframework.boot") version "3.3.5"
    id("org.jetbrains.kotlin.plugin.spring") version "2.0.21"
    kotlin("jvm") version "2.0.21"
    id("org.jetbrains.kotlin.plugin.allopen") version "2.0.21"
    kotlin("plugin.noarg") version "2.0.21"
    kotlin("plugin.jpa") version "2.0.21"
    id("org.jlleitschuh.gradle.ktlint") version "12.1.1"
    kotlin("plugin.serialization") version "2.0.21"
}

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(17)
}

java {
    withJavadocJar()
    withSourcesJar()
}

noArg {
    invokeInitializers = true
}

configurations.all {
    exclude(group = "org.springframework.boot", module = "spring-boot-starter-logging")
}

tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        freeCompilerArgs.add("-Xjsr305=strict")
        // jvmTarget.set(JvmTarget.JVM_17)
        // javaParameters.set(true)
    }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web:3.3.5")
    implementation("org.springframework.security:spring-security-oauth2-resource-server:6.3.4")
    implementation("org.springframework.security:spring-security-oauth2-jose:6.3.4")
    implementation("org.hibernate.validator:hibernate-validator:8.0.1.Final")
    implementation("jakarta.validation:jakarta.validation-api:3.1.0")
    implementation("org.springframework.boot:spring-boot-starter-actuator:3.3.5")
    implementation("org.springframework.boot:spring-boot-starter-json:3.3.5")
    implementation("org.springframework.boot:spring-boot-starter-security:3.3.5")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa:3.3.5")
    implementation("org.hibernate.orm:hibernate-spatial:6.5.2.Final")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.18.1")
    implementation("org.n52.jackson:jackson-datatype-jts:1.2.10")
    implementation("com.nhaarman.mockitokotlin2:mockito-kotlin:2.2.0")
    implementation("org.flywaydb:flyway-core:10.21.0")
    implementation("org.flywaydb:flyway-database-postgresql:10.21.0")
    implementation("org.jetbrains.kotlin:kotlin-reflect:2.0.21")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:2.0.21")
    implementation("org.springframework.boot:spring-boot-configuration-processor:3.3.5")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
    implementation("org.http4k:http4k-client-apache:5.34.1.0")
    implementation("com.google.code.gson:gson:2.11.0")
    implementation("org.springframework.boot:spring-boot-starter-cache:3.3.5")
    implementation("com.github.ben-manes.caffeine:caffeine:3.1.8")
    implementation("io.hypersistence:hypersistence-utils-hibernate-63:3.9.0")
    implementation("org.springframework.boot:spring-boot-starter-log4j2:3.3.5")
    implementation("io.ktor:ktor-client-core-jvm:2.3.12")
    implementation("io.ktor:ktor-client-java-jvm:2.3.12")
    implementation("io.ktor:ktor-client-content-negotiation-jvm:2.3.12")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:2.3.12")
    implementation("io.sentry:sentry:7.17.0")
    implementation("io.sentry:sentry-log4j2:7.17.0")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0")
    runtimeOnly("org.springframework.boot:spring-boot-devtools:3.3.5")
    runtimeOnly("org.postgresql:postgresql:42.7.4")
    testImplementation("org.assertj:assertj-core:3.26.3")
    testImplementation("org.springframework.security:spring-security-test:6.3.4")
    testImplementation("org.testcontainers:testcontainers:1.20.3")
    testImplementation("org.testcontainers:postgresql:1.20.3")
    testImplementation("io.ktor:ktor-client-mock-jvm:3.0.1")
    testImplementation("jakarta.servlet:jakarta.servlet-api:6.1.0")
    testImplementation("com.squareup.okhttp3:mockwebserver:4.12.0")
    testImplementation("org.springframework.boot:spring-boot-starter-test:3.3.5")
    testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc:3.0.2")
    testImplementation("org.testcontainers:junit-jupiter:1.20.3")
    testImplementation("net.java.dev.jna:jna:5.15.0")
    testImplementation("net.ttddyy:datasource-proxy:1.10.1")
}

group = "fr.gouv.cacem"
version = "VERSION_TO_CHANGE"
description = "MonitorEnv"
java.sourceCompatibility = JavaVersion.VERSION_17

/*
// TODO Re-add this library When there will be no more IDE conflicts
sourceSets {
  create("publicApi") {
    java {
      srcDir("src/main/kotlin/fr/gouv/cacem/monitorenv/infrastructure/api/adapters/publicapi")
    }
  }
}

// This publication is only runned from the CI in Github Actions
publishing {
  repositories {
    maven {
      name = "GitHubPackages"
      url = uri("https://maven.pkg.github.com/mtes-mct/monitorenv")
      credentials {
        username = System.getenv("GITHUB_ACTOR")
        password = System.getenv("GITHUB_TOKEN")
      }
    }
  }
  publications {
    val publicApiSourceJar by tasks.registering(Jar::class) {
      from(sourceSets["publicApi"].allSource)
    }

    register<MavenPublication>("gpr") {
      groupId = "fr.gouv.monitor"
      artifactId = "api"
      version = "VERSION_TO_CHANGE"

      artifact(publicApiSourceJar.get())
    }
  }
}
 */

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

configure<org.jlleitschuh.gradle.ktlint.KtlintExtension> {
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
