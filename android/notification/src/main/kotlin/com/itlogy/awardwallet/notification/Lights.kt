package com.itlogy.awardwallet.notification

import android.graphics.Color
import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.Expose

class Lights() : Parcelable {

    @Expose
    var argb = Color.BLUE

    @Expose
    var offMs = 5000

    @Expose
    var onMs = 1000

    constructor(parcel: Parcel) : this() {
        readFromParcel(parcel)
    }

    protected fun readFromParcel(parcel: Parcel) {
        argb = parcel.readInt()
        offMs = parcel.readInt()
        onMs = parcel.readInt()
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeInt(argb)
        parcel.writeInt(offMs)
        parcel.writeInt(onMs)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<Lights> {
        override fun createFromParcel(parcel: Parcel): Lights {
            return Lights(parcel)
        }

        override fun newArray(size: Int): Array<Lights?> {
            return arrayOfNulls(size)
        }
    }

}