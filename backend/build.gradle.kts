plugins {
    `java-library`
    `maven-publish`
    id("org.springframework.boot") version "3.4.3"
    id("org.jlleitschuh.gradle.ktlint") version "12.2.0"
    kotlin("jvm") version "2.1.10"
    kotlin("plugin.spring") version "2.1.10"
    kotlin("plugin.allopen") version "2.1.10"
    kotlin("plugin.noarg") version "2.1.10"
    kotlin("plugin.jpa") version "2.1.10"
    kotlin("plugin.serialization") version "2.1.10"
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
    implementation("org.springframework.boot:spring-boot-starter-web:3.4.3")
    implementation("org.springframework.security:spring-security-oauth2-resource-server:6.4.3")
    implementation("org.springframework.security:spring-security-oauth2-jose:6.4.3")
    implementation("org.hibernate.validator:hibernate-validator:8.0.2.Final")
    implementation("jakarta.validation:jakarta.validation-api:3.1.1")
    implementation("org.springframework.boot:spring-boot-starter-actuator:3.4.3")
    implementation("org.springframework.boot:spring-boot-starter-json:3.4.3")
    implementation("org.springframework.boot:spring-boot-starter-security:3.4.3")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa:3.4.3")
    implementation("org.hibernate.orm:hibernate-spatial:6.6.9.Final")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.18.3")
    implementation("org.n52.jackson:jackson-datatype-jts:1.2.10")
    implementation("com.nhaarman.mockitokotlin2:mockito-kotlin:2.2.0")
    implementation("org.flywaydb:flyway-core:11.3.4")
    implementation("org.flywaydb:flyway-database-postgresql:11.3.4")
    implementation("org.jetbrains.kotlin:kotlin-reflect:2.1.10")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:2.1.10")
    implementation("org.springframework.boot:spring-boot-configuration-processor:3.4.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0")
    implementation("org.http4k:http4k-client-apache:5.46.0.0")
    implementation("com.google.code.gson:gson:2.12.1")
    implementation("org.springframework.boot:spring-boot-starter-cache:3.4.3")
    implementation("com.github.ben-manes.caffeine:caffeine:3.2.0")
    implementation("io.hypersistence:hypersistence-utils-hibernate-63:3.9.2")
    implementation("org.springframework.boot:spring-boot-starter-log4j2:3.4.3")
    implementation("io.ktor:ktor-client-core-jvm:3.1.1")
    implementation("io.ktor:ktor-client-java-jvm:3.1.1")
    implementation("io.ktor:ktor-client-content-negotiation-jvm:3.1.1")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:3.1.1")
    implementation("io.sentry:sentry:8.3.0")
    implementation("io.sentry:sentry-log4j2:8.3.0")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.5")
    runtimeOnly("org.springframework.boot:spring-boot-devtools:3.4.3")
    runtimeOnly("org.postgresql:postgresql:42.7.5")
    testImplementation("org.assertj:assertj-core:3.27.3")
    testImplementation("org.springframework.security:spring-security-test:6.4.3")
    testImplementation("org.testcontainers:testcontainers:1.20.5")
    testImplementation("org.testcontainers:postgresql:1.20.5")
    testImplementation("io.ktor:ktor-client-mock-jvm:3.1.1")
    testImplementation("jakarta.servlet:jakarta.servlet-api:6.1.0")
    testImplementation("com.squareup.okhttp3:mockwebserver:4.12.0")
    testImplementation("org.springframework.boot:spring-boot-starter-test:3.4.3")
    testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc:3.0.3")
    testImplementation("org.testcontainers:junit-jupiter:1.20.5")
    testImplementation("net.java.dev.jna:jna:5.16.0")
    testImplementation("net.ttddyy:datasource-proxy:1.10.1")
    testImplementation("io.mockk:mockk:1.13.17")
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
