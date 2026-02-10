package com.itlogy.awardwallet.notification

import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.Expose

class Action() : Parcelable {

    @Expose
    var action: String? = null

    @Expose
    var allowGeneratedReplies: Boolean? = null

    @Expose
    var icon: String? = null

    @Expose
    var remoteInputs: List<RemoteInput>? = null

    @Expose
    var showUserInterface = false

    @Expose
    var title: String? = null

    constructor(parcel: Parcel) : this() {
        readFromParcel(parcel)
    }

    protected fun readFromParcel(parcel: Parcel) {
        action = parcel.readString()
        allowGeneratedReplies = parcel.readValue(Boolean::class.java.classLoader) as? Boolean
        icon = parcel.readString()
        remoteInputs = parcel.createTypedArrayList(RemoteInput)
        showUserInterface = parcel.readByte() != 0.toByte()
        title = parcel.readString()
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeString(action)
        parcel.writeValue(allowGeneratedReplies)
        parcel.writeString(icon)
        parcel.writeTypedList(remoteInputs)
        parcel.writeByte(if (showUserInterface) 1 else 0)
        parcel.writeString(title)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<Action> {
        override fun createFromParcel(parcel: Parcel): Action {
            return Action(parcel)
        }

        override fun newArray(size: Int): Array<Action?> {
            return arrayOfNulls(size)
        }
    }

}