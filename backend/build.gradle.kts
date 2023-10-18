plugins {
  id("java")
  `maven-publish`
}

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
    register<MavenPublication>("monitorenv") {
      groupId = "fr.gouv.monitor"
      artifactId = "api"
      version = "VERSION_TO_CHANGE"

      from(components["java"])
    }
  }
}
