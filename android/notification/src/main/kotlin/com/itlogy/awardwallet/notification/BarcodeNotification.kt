package com.itlogy.awardwallet.notification

import android.content.Context
import android.graphics.*
import android.os.Build
import android.os.Parcel
import android.os.Parcelable
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.widget.*
import com.google.gson.annotations.Expose
import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.MultiFormatWriter
import com.google.zxing.WriterException
import com.google.zxing.datamatrix.encoder.SymbolShapeHint
import com.google.zxing.pdf417.encoder.Dimensions
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel
import java.io.IOException
import java.io.InputStream
import java.util.*

class BarcodeNotification() : Notification() {

    init {
        id = 0
        title = "<empty>"
        priority = NotificationCompat.PRIORITY_HIGH
        category = NotificationCompat.CATEGORY_REMINDER
        channel = "retail_cards"
    }

    @Expose
    var ex: String? = null

    @Expose
    var providerLogo: String? = null

    @Expose
    var providerBgColor: String? = "#515766"

    @Expose
    var providerFontColor: String? = "#000000"

    @Expose
    var displayName: String? = null

    @Expose
    var userName: String? = null

    @Expose
    var barCodeData: String? = null

    @Expose
    var barCodeType: String? = null
        get() {
            if (field != null && field == "PDF417") {
                field = "PDF_417"
            }
            if (field != null && field == "AZTECCODE") {
                field = "AZTEC"
            }
            return field
        }

    @Expose
    var properties: List<Property> = arrayListOf()


    private var appIcon: Bitmap? = null
    private var font: Typeface? = null
    private var fontBold: Typeface? = null
    private var inflater: LayoutInflater? = null


    constructor(parcel: Parcel) : this() {
        super.readFromParcel(parcel)
        ex = parcel.readString()
        providerLogo = parcel.readString()
        providerBgColor = parcel.readString()
        providerFontColor = parcel.readString()
        displayName = parcel.readString()
        userName = parcel.readString()
        barCodeData = parcel.readString()
        barCodeType = parcel.readString()
        properties = ArrayList<Property>()
        parcel.readList(properties, Property::class.java.classLoader)
    }

    fun parseProviderBgColor(): Int {
        try {
            return Color.parseColor(providerBgColor)
        } catch (e: IllegalArgumentException) {
            return Color.WHITE
        }
    }

    fun parseProviderFontColor(): Int {
        try {
            return Color.parseColor(providerFontColor)
        } catch (e: IllegalArgumentException) {
            return Color.BLACK
        }
    }


    override suspend fun build(context: Context): NotificationCompat.Builder? {
        return barCodeType?.let {
            val barcode: Bitmap?
            val barcodeFormat: BarcodeFormat
            var squareBarcode = false
            try {
                barcodeFormat = BarcodeFormat.valueOf(it)
                squareBarcode = BarcodeFormat.AZTEC === barcodeFormat || BarcodeFormat.QR_CODE == barcodeFormat || BarcodeFormat.DATA_MATRIX == barcodeFormat

                barcode = getBarcode(context, barCodeData, squareBarcode, barcodeFormat, properties.size > 0)
                if (barcode == null) return null
            } catch (e: IllegalArgumentException) {
                return null
            }

            tag = tag ?: "barcode.$ex"

            return super.build(context)?.let {
                it.setOnlyAlertOnce(true)
                // provider logo
                val providerLargeLogo = getProviderLogo(context)
                var providerSmallLogo: Bitmap? = null
                if (providerLargeLogo != null) {
                    providerSmallLogo = getProviderSmallLogo(context, providerLargeLogo)
                }

                // collapsed view
                setCollapsedRemoteViews(context, it, providerSmallLogo)

                // expanded view
                setExpandedRemoteViews(context, it, barcode, squareBarcode, barcodeFormat, providerLargeLogo)

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    it.setStyle(NotificationCompat.DecoratedCustomViewStyle())
                }
                return it
            }
        }
    }

    private fun setCollapsedRemoteViews(context: Context, builder: NotificationCompat.Builder, smallLogo: Bitmap?) {
        val collapsedView = RemoteViews(context.packageName,  R.layout.notification_barcode_collapsed)

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            collapsedView.setImageViewBitmap(R.id.imageview_notification_icon,
                    getAppIconWithBackground(context))
        }

        collapsedView.setTextViewText(R.id.textview_notification_barcode_collapsed_body, body)

        collapsedView.setViewVisibility(R.id.imageview_notification_barcode_collapsed_largeicon,
                if (smallLogo != null) View.VISIBLE else View.GONE)
        if (smallLogo != null) {
            collapsedView.setImageViewBitmap(R.id.imageview_notification_barcode_collapsed_largeicon, smallLogo)
        }

        builder.setCustomContentView(collapsedView)
        builder.setCustomHeadsUpContentView(collapsedView)
    }

    private fun getAppIconWithBackground(context: Context): Bitmap? {
        if (this.appIcon != null) return this.appIcon
        val color = ContextCompat.getColor(context, R.color.notification_icon)
        val backgroundSize = context.resources.getDimension(R.dimen.notification_custom_big_circle_size)
        val iconSize = context.resources.getDimension(R.dimen.notification_custom_icon_size)
        this.appIcon = createColoredBitmap(context, R.drawable.notification_icon_bg,
                if (color == NotificationCompat.COLOR_DEFAULT) 0 else color, backgroundSize.toInt())
        val canvas = Canvas(this.appIcon!!)
        val icon = context.resources.getDrawable(R.drawable.icon_notification, null).mutate()
        icon.isFilterBitmap = true
        val inset = ((backgroundSize - iconSize) / 2).toInt()
        icon.setBounds(inset, inset, (iconSize + inset).toInt(), (iconSize + inset).toInt())
        icon.colorFilter = PorterDuffColorFilter(Color.WHITE, PorterDuff.Mode.SRC_ATOP)
        icon.draw(canvas)
        return this.appIcon
    }

    private fun createColoredBitmap(context: Context, iconId: Int, color: Int, size: Int): Bitmap {
        val drawable = context.resources.getDrawable(iconId, null)
        val resultBitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        drawable.setBounds(0, 0, size, size)
        if (color != 0) {
            drawable.mutate().colorFilter = PorterDuffColorFilter(color, PorterDuff.Mode.SRC_IN)
        }
        val canvas = Canvas(resultBitmap)
        drawable.draw(canvas)
        return resultBitmap
    }

    private fun setExpandedRemoteViews(context: Context, builder: NotificationCompat.Builder, barcode: Bitmap,
                                       squareBarcode: Boolean, barcodeFormat: BarcodeFormat, logo: Bitmap?) {
        val expandedView = RemoteViews(context.packageName, R.layout.notification_barcode_expanded)

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            expandedView.setImageViewBitmap(R.id.imageview_notification_icon,
                    getAppIconWithBackground(context))
            expandedView.setTextViewText(R.id.textview_notification_appname, context.packageManager.getApplicationLabel(context.applicationInfo))
        }

        expandedView.setImageViewBitmap(R.id.imageview_notification_barcode_expanded_card, drawBarcodeCard(context, barcode, squareBarcode, barcodeFormat, logo))
        builder.setCustomBigContentView(expandedView)
    }

    private fun drawBarcodeCard(context: Context, barcode: Bitmap, squareBarcode: Boolean, barcodeFormat: BarcodeFormat, logo: Bitmap?): Bitmap? {
        val res = context.resources
        val cardWidth = res.getDimension(R.dimen.notification_barcode_card_width)
        val cardHeight = res.getDimension(R.dimen.notification_barcode_card_height)
        val cardRadius = res.getDimension(R.dimen.notification_barcode_card_radius)
        val headerHeight = res.getDimension(R.dimen.notification_barcode_header_height)
        val cardRect = RectF(0f, 0f, cardWidth, cardHeight)
        font = Typeface.createFromAsset(context.assets, FONT)
        fontBold = Typeface.create(font, Typeface.BOLD)

        val card = Bitmap.createBitmap(cardRect.width().toInt(), cardRect.height().toInt(), Bitmap.Config.ARGB_8888)
        val canvas = Canvas(card)

        // header bg color
        val paint = Paint()
        paint.style = Paint.Style.FILL
        paint.color = parseProviderBgColor()
        var path = Path()
        path.moveTo(0f, headerHeight)
        path.lineTo(0f, cardRadius)
        path.arcTo(RectF(0f, 0f, cardRadius * 2, cardRadius * 2), 180f, 90f, false)
        path.lineTo(cardWidth - cardRadius, 0f)
        path.arcTo(RectF(cardWidth - cardRadius * 2, 0f, cardWidth, cardRadius * 2), 270f, 90f, false)
        path.lineTo(cardWidth, headerHeight)
        path.close()
        canvas.drawPath(path, paint)

        paint.color = ContextCompat.getColor(context, R.color.notification_barcode_bg)
        path = Path()
        path.moveTo(0f, headerHeight)
        path.lineTo(cardWidth, headerHeight)
        path.lineTo(cardWidth, cardHeight - cardRadius)
        path.arcTo(RectF(cardWidth - cardRadius * 2, cardHeight - cardRadius * 2, cardWidth, cardHeight), 0f, 90f, false)
        path.lineTo(cardRadius, cardHeight)
        path.arcTo(RectF(0f, cardHeight - cardRadius * 2, cardRadius * 2, cardHeight), 90f, 90f, false)
        path.close()
        canvas.drawPath(path, paint)

        // card border
        paint.style = Paint.Style.STROKE
        paint.isAntiAlias = true
        paint.color = ContextCompat.getColor(context, R.color.notification_barcode_stroke)
        paint.strokeWidth = res.getDimension(R.dimen.notification_barcode_card_stroke)

        val pad = 1f
        val cardArea = RectF(pad, pad, cardWidth - pad, cardHeight - pad)
        canvas.drawRoundRect(cardArea, cardRadius, cardRadius, paint)

        inflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        return inflater?.let {
            // header
            val layout = it.inflate(R.layout.notification_barcode_card_header, null) as RelativeLayout

            val displayName = displayName
            val userName = userName
            val fontColor = parseProviderFontColor()

            var tv = layout.findViewById<TextView>(R.id.textview_notification_barcode_expanded_displayname)
            if (displayName != null && "" != displayName) {
                tv.visibility = View.VISIBLE
                tv.setTextColor(fontColor)
                tv.typeface = font
                tv.text = displayName
            } else {
                tv.visibility = View.GONE
            }

            tv = layout.findViewById(R.id.textview_notification_barcode_expanded_username)
            if (userName != null && "" != userName) {
                tv.visibility = View.VISIBLE
                tv.setTextColor(fontColor)
                tv.typeface = font
                tv.text = userName
            } else {
                tv.visibility = View.GONE
            }

            // logo
            val logoView = layout.findViewById<ImageView>(R.id.imageview_notification_barcode_expanded_logo)
            if (logo != null) {
                logoView.visibility = View.VISIBLE
                logoView.setImageBitmap(logo)
            } else {
                logoView.visibility = View.GONE
            }

            layout.measure(View.MeasureSpec.makeMeasureSpec(cardWidth.toInt(), View.MeasureSpec.EXACTLY), View.MeasureSpec.makeMeasureSpec(headerHeight.toInt(), View.MeasureSpec.EXACTLY))
            layout.layout(0, 0, cardWidth.toInt(), headerHeight.toInt())
            layout.isDrawingCacheEnabled = true

            canvas.drawBitmap(layout.drawingCache, 0f, 0f, null)

            drawContent(canvas, context, barcode, barcodeFormat, squareBarcode)

            return card
        }
    }

    private fun drawContent(canvas: Canvas, context: Context, barcode: Bitmap, barcodeFormat: BarcodeFormat, vertical: Boolean) {
        inflater?.let {
            val res = context.resources
            val cardWidth = res.getDimension(R.dimen.notification_barcode_card_width)
            val cardHeight = res.getDimension(R.dimen.notification_barcode_card_height)
            val headerHeight = res.getDimension(R.dimen.notification_barcode_header_height)
            val layout: RelativeLayout
            if (vertical) {
                layout = it.inflate(R.layout.notification_barcode_card_vertical_content, null) as RelativeLayout
            } else {
                layout = it.inflate(R.layout.notification_barcode_card_horizontal_content, null) as RelativeLayout
            }
            val propertiesView = layout.findViewById<LinearLayout>(R.id.notification_barcode_expanded_properties)
            val properties = properties
            if (!properties.isEmpty()) {
                propertiesView.visibility = View.VISIBLE
                propertiesView.weightSum = if (properties.size > 3) 3f else properties.size.toFloat()
                val iterator = properties.iterator()
                var prop: Property
                var num = 0
                var propView: LinearLayout
                var valueView: TextView
                var lp: LinearLayout.LayoutParams
                val margin = if (vertical)
                    res.getDimension(R.dimen.notification_barcode_content_properties_vertical_margin).toInt()
                else
                    res.getDimension(R.dimen.notification_barcode_content_properties_horizontal_margin).toInt()
                while (iterator.hasNext() && num < 3) {
                    prop = iterator.next()
                    lp = LinearLayout.LayoutParams(if (vertical) LinearLayout.LayoutParams.WRAP_CONTENT else 0, LinearLayout.LayoutParams.WRAP_CONTENT)
                    lp.weight = 1f

                    if (vertical) {
                        propView = it.inflate(R.layout.notification_barcode_card_vproperty, null) as LinearLayout
                    } else {
                        propView = it.inflate(R.layout.notification_barcode_card_hproperty, null) as LinearLayout
                    }
                    valueView = propView.findViewById(R.id.notification_barcode_expanded_property_value)
                    when (properties.size) {
                        1 -> {
                            propView.gravity = if (!vertical) Gravity.CENTER_HORIZONTAL else Gravity.CENTER_VERTICAL
                            if (!vertical) {
                                valueView.gravity = Gravity.CENTER_HORIZONTAL
                            }
                            setProperty(context, prop, propView, !vertical)
                            propertiesView.addView(propView)
                        }

                        2 -> {
                            propView.gravity = if (num == 0)
                                if (!vertical) Gravity.START else Gravity.CENTER_VERTICAL
                            else if (!vertical) Gravity.END else Gravity.CENTER_VERTICAL
                            if (!vertical) {
                                valueView.gravity = if (num == 0) Gravity.START else Gravity.END
                            }
                            if (num == 0) {
                                if (vertical)
                                    lp.bottomMargin = margin
                                else
                                    lp.rightMargin = margin
                            }
                            setProperty(context, prop, propView, !vertical)
                            propertiesView.addView(propView)
                        }

                        else -> {
                            val gravity: Int
                            if (num == 0)
                                gravity = if (!vertical) Gravity.START else Gravity.CENTER_VERTICAL
                            else if (num == 1)
                                gravity = if (!vertical) Gravity.CENTER_HORIZONTAL else Gravity.CENTER_VERTICAL
                            else
                                gravity = if (!vertical) Gravity.END else Gravity.CENTER_VERTICAL

                            propView.gravity = gravity
                            if (!vertical) {
                                valueView.gravity = gravity
                            }
                            if (num < 2) {
                                if (vertical)
                                    lp.bottomMargin = margin
                                else
                                    lp.rightMargin = margin
                            }
                            setProperty(context, prop, propView, !vertical)
                            propertiesView.addView(propView)
                        }
                    }
                    propView.layoutParams = lp
                    num++
                }
            } else {
                propertiesView.visibility = View.GONE
                if (vertical) {
                    val squareCodeLayout = layout.findViewById<LinearLayout>(R.id.notification_barcode_expanded_square)
                    val params = squareCodeLayout.layoutParams as RelativeLayout.LayoutParams
                    params.removeRule(RelativeLayout.ALIGN_PARENT_END)
                    squareCodeLayout.layoutParams = params
                }
            }

            val barcodeView = layout.findViewById<ImageView>(R.id.imageview_notification_barcode_expanded)
            val barcodeDataView = layout.findViewById<TextView>(R.id.textview_notification_barcode_expanded_barcodedata)
            barcodeView.setImageBitmap(barcode)
            if (barcodeDataView != null) {
                if (BarcodeFormat.PDF_417 != barcodeFormat) {
                    barcodeDataView.visibility = View.VISIBLE
                    barcodeDataView.typeface = font
                    barcodeDataView.text = barCodeData

                } else {
                    barcodeDataView.visibility = View.GONE
                }
            }

            layout.measure(View.MeasureSpec.makeMeasureSpec(cardWidth.toInt(), View.MeasureSpec.EXACTLY),
                    View.MeasureSpec.makeMeasureSpec((cardHeight - headerHeight).toInt(), View.MeasureSpec.EXACTLY))
            layout.layout(0, headerHeight.toInt(), cardWidth.toInt(), cardHeight.toInt())
            layout.isDrawingCacheEnabled = true
            canvas.drawBitmap(layout.drawingCache, 0f, headerHeight.toInt().toFloat(), null)
        }
    }

    private fun setProperty(context: Context, prop: Property, view: LinearLayout, horizontal: Boolean) {
        var textView = view.findViewById<TextView>(R.id.notification_barcode_expanded_property_name)
        textView.text = prop.name
        textView.typeface = font

        textView = view.findViewById(R.id.notification_barcode_expanded_property_value)
        textView.text = prop.value
        textView.typeface = fontBold

        if (prop is BalanceProperty) {
            val change = prop.change
            if (change != null && !change.isEmpty()) {
                val changeLayout = view.findViewById<LinearLayout>(R.id.notification_barcode_expanded_property_ext)
                changeLayout.visibility = View.VISIBLE
                textView = view.findViewById(R.id.textview_notification_barcode_expanded_property_balance_change)
                val imageView: ImageView
                if ("+" == change.substring(0, 1)) {
                    imageView = view.findViewById(R.id.imageview_notification_barcode_expanded_property_balance_up)
                    imageView.visibility = View.VISIBLE
                    textView.setTextColor(ContextCompat.getColor(context, R.color.notification_barcode_balanceup))
                    textView.text = change
                } else if ("-" == change.substring(0, 1)) {
                    imageView = view.findViewById(R.id.imageview_notification_barcode_expanded_property_balance_down)
                    imageView.visibility = View.VISIBLE
                    textView.setTextColor(ContextCompat.getColor(context, R.color.notification_barcode_balancedown))
                    textView.text = change
                }
            }
        } else if (horizontal) {
            textView.maxLines = 2
        }
    }

    private fun getProviderLogo(context: Context): Bitmap? {
        val logo = providerLogo
        val bgColor = providerBgColor
        if (logo == null || "" == logo || bgColor == null || "" == bgColor) return null
        val assetManager = context.assets
        val istr: InputStream
        try {
            istr = assetManager.open("logos/$logo.png")
            val res = context.resources
            val targetRect = RectF(0f, 0f,
                    res.getDimension(R.dimen.notification_barcode_logo_width),
                    res.getDimension(R.dimen.notification_barcode_logo_height))

            val options = BitmapFactory.Options()
            options.inJustDecodeBounds = true
            BitmapFactory.decodeStream(istr, null, options)
            val imageRect = RectF(0f, 0f, options.outWidth.toFloat(), options.outHeight.toFloat())
            istr.reset()

            options.inJustDecodeBounds = false
            options.inPreferredConfig = Bitmap.Config.ARGB_8888
            options.inScaled = true
            if (targetRect.width() / imageRect.width() < targetRect.height() / imageRect.height() && targetRect.width() < imageRect.width()) {
                options.inDensity = imageRect.width().toInt()
                options.inTargetDensity = targetRect.width().toInt()
            } else if (targetRect.height() < imageRect.height()) {
                options.inDensity = imageRect.height().toInt()
                options.inTargetDensity = targetRect.height().toInt()
            }
            val bitmap = BitmapFactory.decodeStream(istr, null, options)
            bitmap?.density = 1
            return bitmap
        } catch (e: IOException) {
//            e.message?.let {
//                throw NotificationException(it)
//            }
            return null
        }

    }

    private fun getProviderSmallLogo(context: Context, largeProviderLogo: Bitmap): Bitmap {
        val res = context.resources
        val targetRect = RectF(0f, 0f,
                res.getDimension(R.dimen.notification_barcode_small_logo_width),
                res.getDimension(R.dimen.notification_barcode_small_logo_height))
        val largeLogoRect = RectF(0f, 0f,
                largeProviderLogo.width.toFloat(),
                largeProviderLogo.height.toFloat())

        val radius = res.getDimension(R.dimen.notification_barcode_small_logo_radius)
        val smallLogo = Bitmap.createBitmap(targetRect.width().toInt(), targetRect.height().toInt(), Bitmap.Config.ARGB_8888)
        smallLogo.density = 1
        val canvas = Canvas(smallLogo)
        canvas.drawColor(Color.TRANSPARENT)
        val paint = Paint()
        paint.style = Paint.Style.FILL
        paint.isAntiAlias = true
        paint.color = parseProviderBgColor()
        canvas.drawRoundRect(targetRect, radius, radius, paint)
        val padding = res.getDimension(R.dimen.notification_barcode_small_logo_padding)
        targetRect.left += padding
        targetRect.top += padding
        targetRect.right -= padding
        targetRect.bottom -= padding
        val m = Matrix()
        m.setRectToRect(largeLogoRect, targetRect, Matrix.ScaleToFit.CENTER)
        canvas.drawBitmap(largeProviderLogo, m, null)

        return smallLogo
    }

    private fun getBarcode(context: Context, content: String?, squareBarcode: Boolean, format: BarcodeFormat, withProperties: Boolean): Bitmap? {
        if (content == null || content == "")
            return null

        val res = context.resources
        val barWidth: Float
        var barHeight: Float
        if (squareBarcode) {
            barWidth = res.getDimension(R.dimen.notification_barcode_square_size)
            barHeight = barWidth
        } else {
            barWidth = res.getDimension(R.dimen.notification_barcode_width)
            barHeight = res.getDimension(R.dimen.notification_barcode_height)
            if (!withProperties) {
                barHeight += res.getDimension(R.dimen.notification_barcode_content_horizontal_properties_height)
            }
        }

        return getBarcode(barCodeData, format, barWidth, barHeight)
    }

    private fun getBarcode(content: String?, format: BarcodeFormat, width: Float, height: Float): Bitmap? {
        val writer = MultiFormatWriter()
        val hints = HashMap<EncodeHintType, Any>()
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8")
        if (BarcodeFormat.PDF_417 != format && BarcodeFormat.AZTEC != format) {
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H)
        } else {
            hints.put(EncodeHintType.PDF417_DIMENSIONS, Dimensions(1, 70, 1, 20))
        }
        hints.put(EncodeHintType.DATA_MATRIX_SHAPE, SymbolShapeHint.FORCE_SQUARE)
        if (BarcodeFormat.AZTEC == format) {
            hints.put(EncodeHintType.AZTEC_LAYERS, 0)
        }
        hints.put(EncodeHintType.MARGIN, 0)
        try {
            val encode = writer.encode(content, format, width.toInt(), height.toInt(), hints)
            val w = encode.width
            val h = encode.height
            val pixels = IntArray(w * h)

            for (y in 0 until h) {
                val offset = y * w
                for (x in 0 until w) {
                    pixels[offset + x] = if (encode.get(x, y)) Color.BLACK else Color.WHITE
                }
            }

            val bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
            bitmap.setPixels(pixels, 0, w, 0, 0, w, h)

            val bmWidth = bitmap.width
            val bmHeight = bitmap.height
            val wScalingFactor = width / bmWidth
            val hScalingFactor = height / bmHeight
            val scalingFactor = Math.min(wScalingFactor, hScalingFactor)
            return if (scalingFactor > 1)
                Bitmap.createScaledBitmap(bitmap, (bmWidth * scalingFactor).toInt(),
                        (bmHeight * scalingFactor).toInt(), false)
            else
                bitmap
        } catch (e: WriterException) {
            e.printStackTrace()
        } catch (e: IllegalArgumentException) {
            e.printStackTrace()
        } catch (e: ArrayIndexOutOfBoundsException) {
            e.printStackTrace()
        }

        return null
    }

    companion object {

        private val FONT = "fonts/opensans-regular-webfont.ttf"

        @JvmField
        val CREATOR: Parcelable.Creator<BarcodeNotification> = object : Parcelable.Creator<BarcodeNotification> {
            override fun createFromParcel(source: Parcel): BarcodeNotification = BarcodeNotification(source)
            override fun newArray(size: Int): Array<BarcodeNotification?> = arrayOfNulls(size)
        }

    }

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        super.writeToParcel(parcel, flags)
        parcel.writeString(ex)
        parcel.writeString(providerLogo)
        parcel.writeString(providerBgColor)
        parcel.writeString(providerFontColor)
        parcel.writeString(displayName)
        parcel.writeString(userName)
        parcel.writeString(barCodeData)
        parcel.writeString(barCodeType)
        parcel.writeList(properties)
    }

    override fun describeContents(): Int {
        return 0
    }

}
