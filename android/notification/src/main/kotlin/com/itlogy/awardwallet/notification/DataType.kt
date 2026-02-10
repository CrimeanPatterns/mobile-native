package com.itlogy.awardwallet.notification

import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.Expose

class DataType() : Parcelable {

    @Expose
    var allow = true

    @Expose
    var mimeType: String? = null

    constructor(parcel: Parcel) : this() {
        readFromParcel(parcel)
    }

    protected fun readFromParcel(parcel: Parcel) {
        allow = parcel.readByte() != 0.toByte()
        mimeType = parcel.readString()
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeByte(if (allow) 1 else 0)
        parcel.writeString(mimeType)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<DataType> {
        override fun createFromParcel(parcel: Parcel): DataType {
            return DataType(parcel)
        }

        override fun newArray(size: Int): Array<DataType?> {
            return arrayOfNulls(size)
        }
    }

}