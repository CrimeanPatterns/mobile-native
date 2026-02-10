package com.itlogy.awardwallet.notification

import com.google.gson.GsonBuilder

object Gson {

    val instance: com.google.gson.Gson by lazy {
        GsonBuilder()
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(Notification::class.java, NotificationJsonSerializer())
                .registerTypeAdapter(Property::class.java, PropertyJsonSerializer())
                .create()
    }

}
