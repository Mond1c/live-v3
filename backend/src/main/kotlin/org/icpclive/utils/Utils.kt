package org.icpclive.utils

import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.flow
import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toInstant
import kotlinx.serialization.json.Json
import org.slf4j.LoggerFactory
import java.awt.Color
import java.util.*
import kotlin.reflect.KClass
import kotlin.time.Duration

inline fun <reified T> catchToNull(f: () -> T) = try {
    f()
} catch (_: Exception) {
    null
}

private fun guessDatetimeFormatLocal(time: String) =
    catchToNull { LocalDateTime.parse(time) } ?: catchToNull { LocalDateTime.parse(time.trim().replace(" ", "T")) }


fun guessDatetimeFormat(time: String): Instant =
    catchToNull { Instant.fromEpochMilliseconds(time.toLong() * 1000L) }
    ?: catchToNull { Instant.parse(time) }
    ?: guessDatetimeFormatLocal(time)?.toInstant(TimeZone.currentSystemDefault())
    ?: throw IllegalArgumentException("Failed to parse date: $time")

val Instant.humanReadable: String
    get() = Date(this.toEpochMilliseconds()).toString()

fun tickerFlow(interval: Duration) = flow {
    while (true) {
        emit(null)
        delay(interval)
    }
}

fun defaultJsonSettings() = Json {
    encodeDefaults = true
    isLenient = true
    allowSpecialFloatingPointValues = true
    allowStructuredMapKeys = true
    prettyPrint = false
    useArrayPolymorphism = false
    explicitNulls = false
}

fun getLogger(clazz: KClass<*>) = LoggerFactory.getLogger(clazz.java)!!

fun Color.toHex() = "#%02x%02x%02x%02x".format(red, green, blue, alpha)