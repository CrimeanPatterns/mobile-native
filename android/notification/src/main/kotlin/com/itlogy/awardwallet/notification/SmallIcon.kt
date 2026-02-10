package com.itlogy.awardwallet.notification

import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.Expose

class SmallIcon() : Parcelable {

    @Expose
    var icon: String? = null

    @Expose
    var level: Int? = null

    constructor(parcel: Parcel) : this() {
        readFromParcel(parcel)
    }

    protected fun readFromParcel(parcel: Parcel) {
        icon = parcel.readString()
        level = parcel.readValue(Int::class.java.classLoader) as? Int
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeString(icon)
        parcel.writeValue(level)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<SmallIcon> {
        override fun createFromParcel(parcel: Parcel): SmallIcon {
            return SmallIcon(parcel)
        }

        override fun newArray(size: Int): Array<SmallIcon?> {
            return arrayOfNulls(size)
        }
    }

}