plugins {
    `java-library`
    `maven-publish`
    id("org.springframework.boot") version "3.2.4"
    id("org.jetbrains.kotlin.plugin.spring") version "1.9.10"
    kotlin("jvm") version "1.9.10"
    id("org.jetbrains.kotlin.plugin.allopen") version "1.9.10"
    kotlin("plugin.noarg") version "1.9.10"
    kotlin("plugin.jpa") version "1.9.10"
    id("org.jlleitschuh.gradle.ktlint") version "11.6.1"
    kotlin("plugin.serialization") version "1.9.21"
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
    api("org.springframework.boot:spring-boot-starter-web:3.1.4")
    api("org.hibernate.validator:hibernate-validator:8.0.1.Final")
    api("jakarta.validation:jakarta.validation-api:3.0.2")
    api("org.springframework.boot:spring-boot-starter-actuator:3.1.4")
    api("org.springframework.boot:spring-boot-starter-json:3.1.5")
    api("org.springframework.boot:spring-boot-starter-security:3.1.4")
    api("org.springframework.boot:spring-boot-starter-data-jpa:3.1.4")
    api("org.hibernate.orm:hibernate-spatial:6.2.9.Final")
    api("com.fasterxml.jackson.module:jackson-module-kotlin:2.15.0")
    api("org.n52.jackson:jackson-datatype-jts:1.2.10")
    api("com.nhaarman.mockitokotlin2:mockito-kotlin:2.2.0")
    api("org.flywaydb:flyway-core:9.22.0")
    api("org.jetbrains.kotlin:kotlin-reflect:1.9.10")
    api("org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.9.10")
    api("org.springframework.boot:spring-boot-configuration-processor:3.2.0")
    api("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    api("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.1")
    api("com.neovisionaries:nv-i18n:1.29")
    api("org.http4k:http4k-client-apache:5.10.4.0")
    api("com.google.code.gson:gson:2.10.1")
    api("org.springframework.boot:spring-boot-starter-cache:3.1.4")
    api("com.github.ben-manes.caffeine:caffeine:3.1.5")
    api("org.springframework.security:spring-security-test:6.1.5")
    api("org.testcontainers:testcontainers:1.19.2")
    api("io.hypersistence:hypersistence-utils-hibernate-62:3.5.2")
    api("org.assertj:assertj-core:3.24.2")
    api("org.testcontainers:postgresql:1.19.2")
    api("org.springframework.boot:spring-boot-starter-log4j2:3.1.4")
    api("io.ktor:ktor-client-core-jvm:2.3.7")
    api("io.ktor:ktor-client-java-jvm:2.3.7")
    api("io.ktor:ktor-client-content-negotiation-jvm:2.3.7")
    api("io.ktor:ktor-serialization-kotlinx-json-jvm:2.3.7")
    api("io.sentry:sentry:6.31.0")
    api("io.sentry:sentry-log4j2:6.31.0")
    api("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0")
    runtimeOnly("org.springframework.boot:spring-boot-devtools:3.1.4")
    runtimeOnly("org.postgresql:postgresql:42.6.0")
    testImplementation("io.ktor:ktor-client-mock-jvm:2.3.7")
    testImplementation("jakarta.servlet:jakarta.servlet-api:6.0.0")
    testImplementation("com.squareup.okhttp3:mockwebserver:4.10.0")
    testImplementation("org.springframework.boot:spring-boot-starter-test:3.1.5")
    testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc:3.0.0")
    testImplementation("org.testcontainers:junit-jupiter:1.19.2")
    testImplementation("net.java.dev.jna:jna:5.13.0")
    // TODO: move in tests only
    api("net.ttddyy:datasource-proxy:1.10")
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
            additional = mapOf(
                "commit.hash" to "COMMIT_TO_CHANGE",
            )
        }
    }
}

tasks.withType<JavaCompile>() {
    options.encoding = "UTF-8"
}

tasks.withType<Javadoc>() {
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
