package com.itlogy.awardwallet.notification

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Parcel
import android.os.Parcelable
import android.text.Html
import android.text.Spanned
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.RemoteInput
import androidx.core.content.ContextCompat
import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import com.reactnativecommunity.asyncstorage.next.Entry
import com.reactnativecommunity.asyncstorage.next.StorageModule
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.util.*

abstract class Notification() : Parcelable {

    @Expose
    var actions: Array<Action>? = null

    @Expose
    var autoCancel = true

    @Expose
    var badgeIconType: Int? = null

    @Expose
    var bigPicture: BigPicture? = null

    @Expose
    var bigText: BigText? = null

    @Expose
    @SerializedName(value="body", alternate = arrayOf("message"))
    var body: String? = null

    @Expose
    var category: String? = null

    @Expose
    @SerializedName(value="channel", alternate = arrayOf("channelId"))
    var channel: String? = null
        get() = if (Build.VERSION.SDK_INT >= 26) field else null

    @Expose
    var clickAction: String? = null

    @Expose
    var color: String? = null

    @Expose
    var colorized = true

    @Expose
    var contentInfo: String? = null

    @Expose
    var defaults: IntArray? = null

    @Expose
    var forceShow = true

    @Expose
    var group: String? = null

    @Expose
    var groupAlertBehaviour: Int? = null

    @Expose
    var groupSummary = true

    @Expose
    var id = 0

    @Expose
    @SerializedName(value="ongoing", alternate = arrayOf("onlyAlertOnce"))
    var ongoing = false

    @Expose
    var largeIcon: String? = null

    @Expose
    var lights: Lights? = null

    @Expose
    var localOnly = true

    @Expose
    var number: Int? = null

    @Expose
    @SerializedName(value="payload", alternate = arrayOf("data"))
    var payload: JSONObject = JSONObject()

    @Expose
    var people: Array<String>? = null

    @Expose
    var priority = NotificationCompat.PRIORITY_DEFAULT

    @Expose
    var progress: Progress? = null

    @Expose
    var remoteInputHistory: Array<String>? = null

    @Expose
    var shortcutId: String? = null

    @Expose
    var showWhen = true

    @Expose
    var smallIcon: SmallIcon? = null

    @Expose
    var sortKey: String? = null

    @Expose
    var sound: String? = null

    @Expose
    var subtitle: String? = null

    @Expose
    @SerializedName(value="tag", alternate = arrayOf("notificationId"))
    var tag: String? = null

    @Expose
    var ticker: String? = null

    @Expose
    var timeoutAfter: Long? = null

    @Expose
    var title: String? = null

    @Expose
    var usesChronometer: Boolean? = null

    @Expose
    var vibrate: IntArray? = null

    @Expose
    var visibility = NotificationCompat.VISIBILITY_PUBLIC

    @Expose
    @SerializedName(value="when")
    var _when: Long? = null

    open suspend fun build(context: Context): NotificationCompat.Builder? {
        val intentClass = getMainActivityClass(context)
        var nb: NotificationCompat.Builder

        val channel = channel;
        if (channel != null) {
            nb = NotificationCompat.Builder(context, channel)
        } else {
            nb = NotificationCompat.Builder(context)
        }

        body?.let { body -> nb.setContentText(fromHtml(body)) }
        nb.setExtras(jsonToBundle(payload))

        if (Build.VERSION.SDK_INT >= 26) {
            sound?.let { sound -> nb.setSound(getSound(context, sound)) }
        } else {
            // read settings
            val asyncStorage = StorageModule.getStorageInstance(context)

            val entries: List<Entry> = asyncStorage.getValues(listOf("AwardWallet@settings"))

//            ReactDatabaseSupplier.getInstance(context).getReadableDatabase()?.let { readableDatabase ->
//                try {
//                    val settings = JSONObject(AsyncLocalStorageUtil.getItemImpl(readableDatabase, "AwardWallet@settings"))
//                    if (settings.opt("sound") == true) {
//                        val soundName = sound
//                        if (soundName != null) {
//                            nb.setSound(getSound(context, soundName))
//                        } else {
//                            nb.setSound(android.provider.Settings.System.DEFAULT_NOTIFICATION_URI)
//                        }
//                    }
//                    if (settings.opt("vibrate") == true) {
//                        var defaults = defaults
//                        if (defaults == null) defaults = IntArray(1)
//                        defaults[0] = android.app.Notification.DEFAULT_VIBRATE
//                        this.defaults = defaults
//                    }
//                } catch (e: Exception) {
//                }
//            }
        }

        subtitle?.let { subtitle -> nb.setSubText(fromHtml(subtitle)) }
        title?.let { title -> nb.setContentTitle(fromHtml(title)) }
        nb.setAutoCancel(autoCancel)
        badgeIconType?.let { badgeIconType -> nb.setBadgeIconType(badgeIconType) }

        bigPicture?.let { bigPicture ->
            val bp = NotificationCompat.BigPictureStyle()
            bigPicture.picture?.let { picture ->
                getBitmap(context, picture)?.let { bp.bigPicture(it) }
            }
            bigPicture.largeIcon?.let { largeIcon ->
                getBitmap(context, largeIcon)?.let { bp.bigLargeIcon(it) }
            }
            bigPicture.contentTitle?.let { contentTitle -> bp.setBigContentTitle(fromHtml(contentTitle)) }
            bigPicture.summaryText?.let { summaryText -> bp.setSummaryText(fromHtml(summaryText)) }
            nb = nb.setStyle(bp)
        }

        bigText?.let { bigText ->
            val bt = NotificationCompat.BigTextStyle()
            bigText.text?.let { text -> bt.bigText(fromHtml(text)) }
            bigText.contentTitle?.let { contentTitle -> bt.setBigContentTitle(fromHtml(contentTitle)) }
            bigText.summaryText?.let { summaryText -> bt.setSummaryText(fromHtml(summaryText)) }
            nb = nb.setStyle(bt)
        }

        if (bigPicture == null && bigText == null) {
            val bt = NotificationCompat.BigTextStyle()
            bt.bigText(fromHtml(body))
            bt.setBigContentTitle(fromHtml(title))
            nb = nb.setStyle(bt)
        }

        category?.let { category -> nb.setCategory(category) }
        nb.setColor(
            ContextCompat.getColor(context, getResourceId(context, "color", "notification_icon"))
        )
        color?.let { color -> nb.setColor(Color.parseColor(color)) }
        nb.setColorized(colorized)
        contentInfo?.let { contentInfo -> nb.setContentInfo(contentInfo) }

        defaults?.let { def ->
            var defaults = 0
            for (d in def) {
                defaults = defaults or d
            }
            nb = nb.setDefaults(defaults)
        }

        group?.let { group -> nb.setGroup(group) }
        groupAlertBehaviour?.let { groupAlertBehaviour -> nb.setGroupAlertBehavior(groupAlertBehaviour) }
        nb.setGroupSummary(groupSummary)
        largeIcon?.let { largeIcon ->
            getBitmap(context, largeIcon)?.let { nb.setLargeIcon(it) }
        }

        lights?.let { lights ->
            nb.setLights(lights.argb, lights.onMs, lights.offMs)
        }

        nb.setLocalOnly(localOnly)
        number?.let { number -> nb.setNumber(number) }
        nb.setOngoing(ongoing)

        people?.let { people ->
            for (person in people) {
                nb = nb.addPerson(person)
            }
        }

        nb.setPriority(priority)

        progress?.let { progress ->
            progress.max?.let { max ->
                progress.progress?.let { p ->
                    nb.setProgress(max, p, progress.indeterminate)
                }
            }
        }

        remoteInputHistory?.let { history -> nb.setRemoteInputHistory(history)}
        shortcutId?.let { shortcutId -> nb.setShortcutId(shortcutId) }
        nb.setShowWhen(showWhen)

        nb.setSmallIcon(getIcon(context, "icon_notification"))
        smallIcon?.let { smallIcon ->
            smallIcon.icon?.let { icon ->
                val smallIconResourceId = getIcon(context, icon)
                if (smallIconResourceId != 0) {
                    val level = smallIcon.level

                    if (level != null) {
                        nb.setSmallIcon(smallIconResourceId, level)
                    } else {
                        nb.setSmallIcon(smallIconResourceId)
                    }
                }
            }
        }

        sortKey?.let { sortKey -> nb.setSortKey(sortKey) }
        nb.setTicker(fromHtml(title))
        ticker?.let { ticker -> nb.setTicker(fromHtml(ticker)) }
        timeoutAfter?.let { timeoutAfter -> nb.setTimeoutAfter(timeoutAfter) }
        usesChronometer?.let { usesChronometer -> nb.setUsesChronometer(usesChronometer) }
        vibrate?.let { vibrate ->
            val vibrateArray = LongArray(vibrate.size)
            for (i in vibrate.indices) {
                vibrateArray[i] = vibrate[i].toLong()
            }
            nb = nb.setVibrate(vibrateArray)
        }
        nb.setVisibility(visibility)
        _when?.let { _when -> nb.setWhen(_when) }

        if (tag == null) {
            id = Random().nextInt(Integer.MAX_VALUE - 2 + 1) + 2
            tag = context.packageManager.getApplicationLabel(context.applicationInfo) as String
        }

        // Build any actions
        actions?.let {actions ->
            for (a in actions) {
                val action = createAction(context, a, intentClass, this)
                nb.addAction(action)
            }
        }

        // Create the notification intent
        val contentIntent = createIntent(context, intentClass, this, clickAction)
        nb = nb.setContentIntent(contentIntent)

        return nb
    }

    fun toJson(): String {
        return Gson.instance.toJson(this, Notification::class.java)
    }

    protected fun getMainActivityClass(context: Context): Class<*> {
        val packageName = context.getPackageName()
        val launchIntent = context.getPackageManager().getLaunchIntentForPackage(packageName)
        try {
            return Class.forName(launchIntent?.getComponent()?.getClassName().toString())
        } catch (e: ClassNotFoundException) {
            throw NotificationException("Failed to get main activity class", e)
        }
    }

    protected fun fromHtml(source: String?): Spanned? {
        return source?.let {
            Html.fromHtml(source)
        }
    }

    companion object {

        val LOG_TAG = Notification::class.java.simpleName

        fun fromBundle(bundle: Bundle): Notification {
            if (bundle.getBundle("android") != null) {
                bundle.putAll(bundle.getBundle("android"))
            }

            if (bundle.getBundle(NotificationJsonSerializer.DATA) != null) {
                bundle.putAll(bundle.getBundle(NotificationJsonSerializer.DATA))
            } else if (bundle.getString(NotificationJsonSerializer.DATA) != null) {
                try {
                    val payloadJson = JSONObject(bundle.getString(NotificationJsonSerializer.DATA))
                    jsonToBundle(payloadJson).let { payloadBundle ->
                        bundle.putAll(payloadBundle)
                        bundle.putBundle(NotificationJsonSerializer.DATA, payloadBundle)
                    }
                } catch (e: JSONException) {
                    Log.e(LOG_TAG, "execute: Got JSON Exception: ${e.message}", e)
                }
            }
            val json = bundleToJson(bundle).toString()

            return Gson.instance.fromJson(json, Notification::class.java)
        }

        fun fromJson(json: JSONObject): Notification {
            return Gson.instance.fromJson(json.toString(), Notification::class.java)
        }

        @Throws(JSONException::class)
        fun jsonToBundle(json: JSONObject) : Bundle {
            val bundle = Bundle()

            val keys = json.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                val value = json.get(key)

                if (value is String) {
                    bundle.putCharSequence(key, value)

                } else if (value is Boolean) {
                    bundle.putBoolean(key, value)
                } else if (value is Float) {
                    bundle.putFloat(key, value)
                } else if (value is Double) {
                    bundle.putDouble(key, value)
                } else if (value is Int) {
                    bundle.putInt(key, value)
                } else if (value is Long) {
                    bundle.putLong(key, value)
                } else if (value is Byte) {
                    bundle.putByte(key, value)
                } else if (value is Short) {
                    bundle.putShort(key, value)
                } else if (value is JSONObject) {
                    bundle.putBundle(key, jsonToBundle(value))
                } else {
                    bundle.putString(key, json.getString(key))
                }
            }

            return bundle;
        }

        fun bundleToJson(bundle: Bundle?): JSONObject {
            val json = JSONObject()
            if (bundle == null) return json
            for (key in bundle.keySet()) {
                try {
                    val value = bundle.get(key)
                    if (value is Bundle) {
                        json.put(key, bundleToJson(value))
                    } else if (value is Array<*>) {
                        val arr = JSONArray()
                        for (item in value) {
                            if (item is Bundle) {
                                arr.put(bundleToJson(item))
                            } else if (item is JSONObject || item is JSONArray) {
                                arr.put(item)
                            }
                        }
                        json.put(key, arr)
                    } else {
                        json.put(key, JSONObject.wrap(value))
                    }
                } catch (e: JSONException) {
                }

            }

            return json
        }

        private fun getSound(context: Context, sound: String?): Uri? {
            if (sound == null) {
                return null
            } else if (sound.contains("://")) {
                return Uri.parse(sound)
            } else if (sound.equals("default", ignoreCase = true)) {
                return RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            } else {
                var soundResourceId = getResourceId(context, "raw", sound)
                if (soundResourceId == 0) {
                    soundResourceId = getResourceId(context, "raw", sound.substring(0, sound.lastIndexOf('.')))
                }
                return Uri.parse("android.resource://" + context.packageName + "/" + soundResourceId)
            }
        }

        private fun getResourceId(context: Context, type: String, name: String): Int {
            return context.resources.getIdentifier(name, type, context.packageName)
        }

        private fun getIcon(context: Context, icon: String): Int {
            var smallIconResourceId = getResourceId(context, "mipmap", icon)
            if (smallIconResourceId == 0) {
                smallIconResourceId = getResourceId(context, "drawable", icon)
            }
            return smallIconResourceId
        }

        private fun getBitmapFromUrl(imageUrl: String): Bitmap? {
            try {
                val connection = URL(imageUrl).openConnection() as HttpURLConnection
                connection.doInput = true
                connection.connect()
                return BitmapFactory.decodeStream(connection.inputStream)
            } catch (e: IOException) {
                Log.e(LOG_TAG, "Failed to get bitmap for url: $imageUrl", e)
                return null
            }
        }

        private fun getBitmap(context: Context, image: String): Bitmap? {
            if (image.startsWith("http://") || image.startsWith("https://")) {
                return getBitmapFromUrl(image)
            } else if (image.startsWith("file://")) {
                return BitmapFactory.decodeFile(image.replace("file://", ""))
            } else {
                val largeIconResId = getResourceId(context, "mipmap", image)
                return BitmapFactory.decodeResource(context.getResources(), largeIconResId)
            }
        }

        private fun createAction(context: Context, action: Action, intentClass: Class<*>, notification: Notification): NotificationCompat.Action {
            val actionIntent = createIntent(context, intentClass, notification, action.action)

            val actionIcon = action.icon
            val actionTitle = action.title
            if (actionIcon == null || actionTitle == null) {
                throw NotificationException("Missing icon or title of action ${action.action}")
            }

            val icon = getIcon(context, actionIcon)
            var ab = NotificationCompat.Action.Builder(icon, actionTitle, actionIntent)

            action.allowGeneratedReplies?.let { ab.setAllowGeneratedReplies(it) }
            action.remoteInputs?.let { remoteInputs ->
                for (ri in remoteInputs) {
                    createRemoteInput(ri)?.let {
                        ab = ab.addRemoteInput(it)
                    }
                }
            }

            return ab.build()
        }

        private fun createRemoteInput(remoteInput: com.itlogy.awardwallet.notification.RemoteInput): RemoteInput? {
            remoteInput.resultKey?.let {
                val rb = RemoteInput.Builder(it)

                remoteInput.allowedDataTypes?.let { allowedDataTypes ->
                    for (adt in allowedDataTypes) {
                        adt.mimeType?.let { mimeType ->
                            rb.setAllowDataType(mimeType, adt.allow)
                        }
                    }
                }
                remoteInput.allowFreeFormInput?.let { allowFreeFormInput ->
                    rb.setAllowFreeFormInput(allowFreeFormInput)
                }
                remoteInput.choices?.let { choices ->
                    rb.setChoices(choices)
                }
                remoteInput.label?.let { label ->
                    rb.setLabel(label)
                }

                return rb.build()
            }

            return null
        }

        private fun createIntent(context: Context, intentClass: Class<*>, notification: Notification, action: String?): PendingIntent {
            val intent = Intent(context, intentClass)
            intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            action?.let { intent.action = it }
            intent.putExtra("action", action)
            intent.putExtra("notification", jsonToBundle(JSONObject(notification.toJson())))

            return PendingIntent.getActivity(context, notification.id.hashCode(), intent,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) (PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT) else PendingIntent.FLAG_UPDATE_CURRENT)
        }
    }

    protected fun readFromParcel(parcel: Parcel) {
        actions = parcel.createTypedArray(Action)
        autoCancel = parcel.readByte() != 0.toByte()
        badgeIconType = parcel.readValue(Int::class.java.classLoader) as? Int
        bigPicture = parcel.readParcelable(BigPicture::class.java.classLoader)
        bigText = parcel.readParcelable(BigText::class.java.classLoader)
        body = parcel.readString()
        category = parcel.readString()
        channel = parcel.readString()
        clickAction = parcel.readString()
        color = parcel.readString()
        colorized = parcel.readByte() != 0.toByte()
        contentInfo = parcel.readString()
        defaults = parcel.createIntArray()
        forceShow = parcel.readByte() != 0.toByte()
        group = parcel.readString()
        groupAlertBehaviour = parcel.readValue(Int::class.java.classLoader) as? Int
        groupSummary = parcel.readByte() != 0.toByte()
        id = parcel.readInt()
        ongoing = parcel.readByte() != 0.toByte()
        largeIcon = parcel.readString()
        lights = parcel.readParcelable(Lights::class.java.classLoader)
        localOnly = parcel.readByte() != 0.toByte()
        number = parcel.readValue(Int::class.java.classLoader) as? Int
        payload = JSONObject(parcel.readString())
        people = parcel.createStringArray()
        priority = parcel.readInt()
        progress = parcel.readParcelable(Progress::class.java.classLoader)
        remoteInputHistory = parcel.createStringArray()
        shortcutId = parcel.readString()
        showWhen = parcel.readByte() != 0.toByte()
        smallIcon = parcel.readParcelable(SmallIcon::class.java.classLoader)
        sortKey = parcel.readString()
        sound = parcel.readString()
        subtitle = parcel.readString()
        tag = parcel.readString()
        ticker = parcel.readString()
        timeoutAfter = parcel.readValue(Long::class.java.classLoader) as? Long
        title = parcel.readString()
        usesChronometer = parcel.readValue(Boolean::class.java.classLoader) as? Boolean
        vibrate = parcel.createIntArray()
        visibility = parcel.readInt()
        _when = parcel.readValue(Long::class.java.classLoader) as? Long
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeTypedArray(actions, flags)
        parcel.writeByte(if (autoCancel) 1 else 0)
        parcel.writeValue(badgeIconType)
        parcel.writeParcelable(bigPicture, flags)
        parcel.writeParcelable(bigText, flags)
        parcel.writeString(body)
        parcel.writeString(category)
        parcel.writeString(channel)
        parcel.writeString(clickAction)
        parcel.writeString(color)
        parcel.writeByte(if (colorized) 1 else 0)
        parcel.writeString(contentInfo)
        parcel.writeIntArray(defaults)
        parcel.writeByte(if (forceShow) 1 else 0)
        parcel.writeString(group)
        parcel.writeValue(groupAlertBehaviour)
        parcel.writeByte(if (groupSummary) 1 else 0)
        parcel.writeInt(id)
        parcel.writeByte(if (ongoing) 1 else 0)
        parcel.writeString(largeIcon)
        parcel.writeParcelable(lights, flags)
        parcel.writeByte(if (localOnly) 1 else 0)
        parcel.writeValue(number)
        parcel.writeString(payload.toString())
        parcel.writeStringArray(people)
        parcel.writeInt(priority)
        parcel.writeParcelable(progress, flags)
        parcel.writeStringArray(remoteInputHistory)
        parcel.writeString(shortcutId)
        parcel.writeByte(if (showWhen) 1 else 0)
        parcel.writeParcelable(smallIcon, flags)
        parcel.writeString(sortKey)
        parcel.writeString(sound)
        parcel.writeString(subtitle)
        parcel.writeString(tag)
        parcel.writeString(ticker)
        parcel.writeValue(timeoutAfter)
        parcel.writeString(title)
        parcel.writeValue(usesChronometer)
        parcel.writeIntArray(vibrate)
        parcel.writeInt(visibility)
        parcel.writeValue(_when)
    }

    override fun describeContents(): Int {
        return 0
    }

}
