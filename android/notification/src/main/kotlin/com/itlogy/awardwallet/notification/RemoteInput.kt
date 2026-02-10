package com.itlogy.awardwallet.notification

import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.Expose

class RemoteInput() : Parcelable {

    @Expose
    var allowedDataTypes: Array<DataType>? = null

    @Expose
    var allowFreeFormInput: Boolean? = null

    @Expose
    var choices: Array<String>? = null

    @Expose
    var label: String? = null

    @Expose
    var resultKey: String? = null

    constructor(parcel: Parcel) : this() {
        readFromParcel(parcel)
    }

    protected fun readFromParcel(parcel: Parcel) {
        allowedDataTypes = parcel.createTypedArray(DataType)
        allowFreeFormInput = parcel.readValue(Boolean::class.java.classLoader) as? Boolean
        choices = parcel.createStringArray()
        label = parcel.readString()
        resultKey = parcel.readString()
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeTypedArray(allowedDataTypes, flags)
        parcel.writeValue(allowFreeFormInput)
        parcel.writeStringArray(choices)
        parcel.writeString(label)
        parcel.writeString(resultKey)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<RemoteInput> {
        override fun createFromParcel(parcel: Parcel): RemoteInput {
            return RemoteInput(parcel)
        }

        override fun newArray(size: Int): Array<RemoteInput?> {
            return arrayOfNulls(size)
        }
    }

}