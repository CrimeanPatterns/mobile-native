package com.itlogy.awardwallet.notification

import com.google.gson.*
import org.json.JSONObject

class NotificationJsonSerializer : JsonSerializer<Notification>, JsonDeserializer<Notification> {

    private enum class NotificationType {
        text, barcode
    }

    override fun serialize(src: Notification, typeOfSrc: java.lang.reflect.Type, context: JsonSerializationContext): JsonElement {
        if (src is BarcodeNotification) {
            val commonObject = context.serialize(src, BasicNotification::class.java) as JsonObject
            val barcodeObject = context.serialize(src, BarcodeNotification::class.java) as JsonObject
            serializePayload(commonObject, src)
            filterChildProperties(commonObject, barcodeObject)
            commonObject.addProperty(TYPE, NotificationType.barcode.toString())
            commonObject.add(USER_INFO, barcodeObject)
            if (src.ex?.isNotEmpty()!!) {
                barcodeObject.addProperty("ex", src.ex)
            }
            if (barcodeObject.has("ex") && commonObject.has(DATA)) {
                commonObject.get(DATA).asJsonObject.addProperty("ex", barcodeObject.get("ex").asString)
            }

            return commonObject
        } else {
            val jo = context.serialize(src, BasicNotification::class.java)
            serializePayload(jo.asJsonObject, src)

            return jo
        }
    }

    @Throws(JsonParseException::class)
    override fun deserialize(json: JsonElement, typeOfT: java.lang.reflect.Type, context: JsonDeserializationContext): Notification {
        val jo = json.asJsonObject
        var type = NotificationType.text
        if (jo.has(TYPE) && jo.get(TYPE).isJsonPrimitive) {
            try {
                type = NotificationType.valueOf(jo.get(TYPE).asString)
            } catch (e: IllegalArgumentException) {
            }
        }

        if (type == NotificationType.barcode && jo.has(USER_INFO) && jo.get(USER_INFO).isJsonObject) {
            mergeProperties(jo, jo.get(USER_INFO).asJsonObject)
            val bn = context.deserialize<BarcodeNotification>(jo, BarcodeNotification::class.java)
            deserializePayload(jo, bn)

            return bn
        }

        val n: Notification = context.deserialize(json, BasicNotification::class.java)
        deserializePayload(jo, n)
        return n
    }

    private fun filterChildProperties(parent: JsonObject, child: JsonObject) {
        val iterator = child.entrySet().iterator()
        while (iterator.hasNext()) {
            val value = iterator.next()
            if (parent.has(value.key)) {
                iterator.remove()
            }
        }
    }

    private fun mergeProperties(first: JsonObject, second: JsonObject) {
        for ((key, value) in second.entrySet()) {
            first.add(key, value)
        }
    }

    private fun serializePayload(jo: JsonObject, src: Notification) {
        val payload = JsonParser().parse(src.payload.toString()).getAsJsonObject()

        jo.add(DATA, payload)
    }

    private fun deserializePayload(jo: JsonObject, src: Notification) {
        if (!jo.has(DATA) || !jo.get(DATA).isJsonObject) {
            src.payload = JSONObject(jo.toString())
            return
        }

        val payload = jo.getAsJsonObject(DATA)
        src.payload = JSONObject(payload.toString())
    }

    companion object {

        private val TYPE = "categoryIdentifier"
        private val ACCOUNT = "a"
        private val COUPON = "c"
        private val USER_INFO = "userInfo"
        val DATA = "payload"

    }
}
