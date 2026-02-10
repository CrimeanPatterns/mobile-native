package com.itlogy.awardwallet.notification

import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.Expose

class Progress() : Parcelable {

    @Expose
    var max: Int? = null

    @Expose
    var progress: Int? = null

    @Expose
    var indeterminate = true

    constructor(parcel: Parcel) : this() {
       readFromParcel(parcel)
    }

    protected fun readFromParcel(parcel: Parcel) {
        max = parcel.readValue(Int::class.java.classLoader) as? Int
        progress = parcel.readValue(Int::class.java.classLoader) as? Int
        indeterminate = parcel.readByte() != 0.toByte()
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeValue(max)
        parcel.writeValue(progress)
        parcel.writeByte(if (indeterminate) 1 else 0)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<Progress> {
        override fun createFromParcel(parcel: Parcel): Progress {
            return Progress(parcel)
        }

        override fun newArray(size: Int): Array<Progress?> {
            return arrayOfNulls(size)
        }
    }

}