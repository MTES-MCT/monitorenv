plugins {
  `maven-publish`
}

publishing {
  repositories {
    maven {
      groupId = 'fr.gouv.monitor'
      artifactId = 'api'
      version = "test"
      from components.java

      pom {
        name = 'Monitor APIs'
        description = 'API contracts'
      }

      name = "GitHubPackages"
      url = uri("https://maven.pkg.github.com/mtes-mct/monitorenv")
      credentials {
        username = System.getenv("GITHUB_ACTOR")
        password = System.getenv("GITHUB_TOKEN")
      }
    }
  }
  publications {
    register<MavenPublication>("gpr") {
      from(components["java"])
    }
  }
}
