package org.icpclive.sniper

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.context
import com.github.ajalt.clikt.output.MordantHelpFormatter
import com.github.ajalt.clikt.parameters.options.*
import com.github.ajalt.clikt.parameters.types.int
import com.github.ajalt.clikt.parameters.types.path
import io.ktor.util.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.decodeFromStream
import java.security.MessageDigest
import java.util.Base64
import kotlin.io.path.exists

object Config : CliktCommand(name = "java -jar live-v3.jar", printHelpOnEmptyArgs = false) {
    val configDirectory by option(
        "-c", "--config-directory",
        help = "Path to config directory",
    ).path(mustExist = true, canBeFile = false, canBeDir = true).required()

    private val port: Int by option("-p", "--port", help = "Port to listen").int().default(8083)

    private val ktorArgs by option("--ktor-arg", help = "Arguments to forward to ktor server").multiple()

    val snipersTxtPath by option("--snipers-txt", help = "Path to snipers.txt")
        .path(mustExist = true, canBeFile = true, canBeDir = false)
        .defaultLazy("configDirectory/snipers.txt") { configDirectory.resolve("snipers.txt") }

    val overlayURL: String by option("-o", "--overlay", "--overlay-url", help = "Main overlay url").default("http://127.0.0.1:8080")

    private val authDisabled by option(
        "--no-auth",
        help = "Disable http basic auth in admin"
    ).flag()

    private val credsJsonPath by option("--creds", help = "Path to creds.json").path(mustExist = false, canBeFile = true, canBeDir = false)
        .defaultLazy("configDirectory/creds.json") { configDirectory.resolve("creds.json") }

    var basicAuthKey: BasicAuthKey = BasicAuthKey("")


    override fun run() {
        if (!authDisabled) {
            val creds = if (credsJsonPath.exists()) {
                Json.decodeFromStream<AdminCreds>(credsJsonPath.toFile().inputStream())
            } else {
                AdminCreds("admin", "admin")
            }
            basicAuthKey = BasicAuthKey(
                "Basic " +
                        Base64.getEncoder().encodeToString("${creds.username}:${creds.password}".toByteArray())
            )
        }
        io.ktor.server.netty.EngineMain.main((listOf("-port=$port") + ktorArgs).toTypedArray())
    }

    init {
        context {
            helpFormatter = { MordantHelpFormatter(it, showRequiredTag = true, showDefaultValues = true) }
        }
    }

}

val config: Config get() = Config
