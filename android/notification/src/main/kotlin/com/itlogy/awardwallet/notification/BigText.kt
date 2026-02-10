package com.itlogy.awardwallet.notification

import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.Expose

class BigText() : Parcelable {

    @Expose
    var contentTitle: String? = null

    @Expose
    var summaryText: String? = null

    @Expose
    var text: String? = null

    constructor(parcel: Parcel) : this() {
        readFromParcel(parcel)
    }

    protected fun readFromParcel(parcel: Parcel) {
        contentTitle = parcel.readString()
        summaryText = parcel.readString()
        text = parcel.readString()
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeString(contentTitle)
        parcel.writeString(summaryText)
        parcel.writeString(text)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<BigText> {
        override fun createFromParcel(parcel: Parcel): BigText {
            return BigText(parcel)
        }

        override fun newArray(size: Int): Array<BigText?> {
            return arrayOfNulls(size)
        }
    }

}