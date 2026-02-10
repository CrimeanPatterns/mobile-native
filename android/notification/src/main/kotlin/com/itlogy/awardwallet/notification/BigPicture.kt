package com.itlogy.awardwallet.notification

import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.Expose

class BigPicture() : Parcelable {

    @Expose
    var contentTitle: String? = null

    @Expose
    var largeIcon: String? = null

    @Expose
    var picture: String? = null

    @Expose
    var summaryText: String? = null

    constructor(parcel: Parcel) : this() {
        readFromParcel(parcel)
    }

    protected fun readFromParcel(parcel: Parcel) {
        contentTitle = parcel.readString()
        largeIcon = parcel.readString()
        picture = parcel.readString()
        summaryText = parcel.readString()
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeString(contentTitle)
        parcel.writeString(largeIcon)
        parcel.writeString(picture)
        parcel.writeString(summaryText)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<BigPicture> {
        override fun createFromParcel(parcel: Parcel): BigPicture {
            return BigPicture(parcel)
        }

        override fun newArray(size: Int): Array<BigPicture?> {
            return arrayOfNulls(size)
        }
    }

}