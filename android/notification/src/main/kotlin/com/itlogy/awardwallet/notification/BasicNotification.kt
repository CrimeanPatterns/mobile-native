package com.itlogy.awardwallet.notification

import android.os.Parcel
import android.os.Parcelable

class BasicNotification() : Notification() {

    constructor(parcel: Parcel) : this() {
        super.readFromParcel(parcel)
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        super.writeToParcel(parcel, flags)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<BasicNotification> {
        override fun createFromParcel(parcel: Parcel): BasicNotification {
            return BasicNotification(parcel)
        }

        override fun newArray(size: Int): Array<BasicNotification?> {
            return arrayOfNulls(size)
        }
    }

}
