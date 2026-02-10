package com.itlogy.awardwallet.notification

import com.google.gson.*
import java.lang.reflect.Type

class PropertyJsonSerializer : JsonSerializer<Property>, JsonDeserializer<Property> {

    private enum class PropertyType {
        basic, balance
    }

    override fun serialize(src: Property, typeOfSrc: Type, context: JsonSerializationContext): JsonElement {
        if (src is BalanceProperty) {
            val obj = context.serialize(src, BalanceProperty::class.java) as JsonObject
            obj.addProperty(TYPE, PropertyType.balance.toString())
            return obj
        }

        return context.serialize(src, BasicProperty::class.java)
    }

    @Throws(JsonParseException::class)
    override fun deserialize(json: JsonElement, typeOfT: Type, context: JsonDeserializationContext): Property {
        val jo = json.asJsonObject
        var type = PropertyType.basic
        if (jo.has(TYPE) && jo.get(TYPE).isJsonPrimitive) {
            try {
                type = PropertyType.valueOf(jo.get(TYPE).asString)
            } catch (e: IllegalArgumentException) {
            }

        }

        return if (type == PropertyType.balance) {
            context.deserialize(json, BalanceProperty::class.java)
        } else context.deserialize(json, BasicProperty::class.java)

    }

    companion object {

        private val TYPE = "type"
    }

}
