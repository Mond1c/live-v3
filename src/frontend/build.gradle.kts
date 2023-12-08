import com.github.gradle.node.npm.task.NpmTask

plugins {
    alias(libs.plugins.node)
}

node {
    version.set("16.14.0")
    npmInstallCommand.set("ci")
    download.set(rootProject.findProperty("npm.download") == "true")
    fastNpmInstall.set(true)
}

tasks {
    npmInstall {
        inputs.file("admin/package.json")
        inputs.file("overlay/package.json")
    }
    named<NpmTask>("npm_run_buildOverlay") {
        outputs.cacheIf { true }
        environment.set(mapOf("PUBLIC_URL" to "/overlay", "BUILD_PATH" to "build"))
        inputs.dir("overlay/src")
        inputs.file("overlay/index.html")
        inputs.dir("common")
        inputs.file("package.json")
        inputs.file("package-lock.json")
        inputs.file("overlay/package.json")
        outputs.dir("overlay/build")
    }
    named<NpmTask>("npm_run_buildAdmin") {
        outputs.cacheIf { true }
        environment.set(mapOf("PUBLIC_URL" to "/admin", "BUILD_PATH" to "build", "REACT_APP_MODE" to "main"))
        inputs.dir("admin/src")
        inputs.dir("admin/public")
        inputs.dir("common")
        inputs.file("package.json")
        inputs.file("package-lock.json")
        inputs.file("admin/package.json")
        outputs.dir("admin/build")
    }
    named<NpmTask>("npm_run_buildLocatorAdmin") {
        outputs.cacheIf { true }
        environment.set(mapOf("PUBLIC_URL" to "/admin", "BUILD_PATH" to "build_locator", "REACT_APP_MODE" to "locator"))
        inputs.dir("admin/src")
        inputs.dir("admin/public")
        inputs.dir("common")
        inputs.file("package.json")
        inputs.file("package-lock.json")
        inputs.file("admin/package.json")
        outputs.dir("admin/build_locator")
    }
}
