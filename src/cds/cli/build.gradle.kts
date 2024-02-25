plugins {
    `java-library`
    `maven-publish`
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.bcv)
}

kotlin {
    explicitApi()
}

dependencies {
    api(projects.cds.core)
    api(libs.cli)
    implementation(projects.common)
}