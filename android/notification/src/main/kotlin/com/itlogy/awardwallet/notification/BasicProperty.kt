package com.itlogy.awardwallet.notification

import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.Expose

open class BasicProperty() : Property, Parcelable {

    @Expose
    final override var name: String? = null

    @Expose
    final override var value: String? = null

    constructor(parcel: Parcel) : this() {
        readFromParcel(parcel)
    }

    protected fun readFromParcel(parcel: Parcel) {
        name = parcel.readString()
        value = parcel.readString()
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeString(name)
        parcel.writeString(value)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<BasicProperty> {
        override fun createFromParcel(parcel: Parcel): BasicProperty {
            return BasicProperty(parcel)
        }

        override fun newArray(size: Int): Array<BasicProperty?> {
            return arrayOfNulls(size)
        }
    }

}
