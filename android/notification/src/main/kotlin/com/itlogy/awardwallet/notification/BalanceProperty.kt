package com.itlogy.awardwallet.notification

import android.os.Parcel
import android.os.Parcelable
import com.google.gson.annotations.Expose

class BalanceProperty() : BasicProperty() {

    @Expose
    var change: String? = null

    constructor(parcel: Parcel) : this() {
        super.readFromParcel(parcel)
        change = parcel.readString()
    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        super.writeToParcel(parcel, flags)
        parcel.writeString(change)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<BalanceProperty> {
        override fun createFromParcel(parcel: Parcel): BalanceProperty {
            return BalanceProperty(parcel)
        }

        override fun newArray(size: Int): Array<BalanceProperty?> {
            return arrayOfNulls(size)
        }
    }

}
