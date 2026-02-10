//
//  AccountAddTests.swift
//  AwardWalletUITests
//
//  Created by Aleksey Anikin on 03/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import XCTest

class AccountAddTests: AwardWalletUITests {
  
  override func setUp() {
    continueAfterFailure = false
    launchWithReset()
    doLogin()
    app.otherElements["passcode-promo-popup-close"].tap();
    app.buttons["header-account-add"].tap()
    waitFor(element: app.textFields["Find a program to add"], seconds: 2)
  }
  
  override func tearDown() {
    Springboard.deleteApp(appName: "AwardWallet")
  }
  
  func scrollY(element: XCUIElement, offset: Int) {
    let relativeTouchPoint = element.coordinate(withNormalizedOffset: CGVector(dx: 0, dy: 0))
    let relativeOffset = element.coordinate(withNormalizedOffset: CGVector(dx: 0, dy: offset))
    relativeTouchPoint.press(forDuration: 0, thenDragTo: relativeOffset)
  }
  
  func testSubmitEmptyForm() {
    app.otherElements["kind-custom"].tap()
    let header = app.otherElements["Custom Account (Tracked Manually)"]
    waitFor(element: header, seconds: 10)
    let submit = app.buttons["submit"]
    app.scrollDownToElement(element: submit)
    submit.tap()
    waitFor(element: app.staticTexts["This field is required"], seconds: 10)
    let error = "This field is required"
    XCTAssertEqual(app.staticTexts["kind error"].label, error)
    XCTAssertEqual(app.staticTexts["programname error"].label, error)
    XCTAssertEqual(app.staticTexts["login error"].label, error)
  }
  
  func testAddCustomAccount() {
    app.otherElements["kind-custom"].tap()
    let header = app.otherElements["Custom Account (Tracked Manually)"]
    waitFor(element: header, seconds: 10)
    
    let kind = app.otherElements["kind"]
    app.scrollDownToElement(element: kind, maxScrolls: 2)
    kind.tap()
    
    let picker = app.pickerWheels.firstMatch
    picker.adjust(toPickerWheelValue: "Hotels")
    picker.adjust(toPickerWheelValue: "Shopping")
    picker.adjust(toPickerWheelValue: "Other")
    XCTAssert(picker.value as? String == "Other")
    app.buttons["picker-kind-done"].tap()
    
    let programname = app.textFields["programname"]
    let completionText = "United Airlines (Mileage Plus)"
    inputField(field: programname, value: completionText)
    //    let completion = app.otherElements["completion-result-programname"].otherElements["completion-value-1"]
    //    waitFor(element: completion, seconds: 10)
    //    completion.tap()
    
    let url = "https://google.com"
    let loginurl = app.textFields["loginurl"]
    inputField(field: loginurl, value: url)
    
    let newLogin = randomString(length: 5)
    let loginField = app.textFields["login"]
    inputField(field: loginField, value: newLogin)
    
    let balance = "1000"
    let balanceField = app.textFields["balance"]
    balanceField.clearAndEnterText(text: balance)
    XCTAssert(balanceField.value as? String == balance)
    
    scrollY(element: balanceField, offset: -10)
    
    //    let comment = "New comment"
    //    let commentField = app.textFields["comment"]
    //    inputField(field: commentField, value: comment)
    //
    let donttrackexpiration = app.otherElements["donttrackexpiration"]
    donttrackexpiration.tap()
    //XCTAssertEqual(UIAccessibilityTraits.selected, XCUIApplication().otherElements["donttrackexpiration"].accessibilityTraits)
    
    let goal = app.textFields["goal"]
    inputField(field: goal, value: "1000")
    
    //    let expirationdate = app.otherElements["expirationdate"]
    //    expirationdate.tap()
    //    app.otherElements["datepicker-done"].tap()
    
    app.scrollDown()
    
    app.buttons["submit"].tap()
    
    waitFor(element: app.otherElements["United Airlines (Mileage Plus)"], seconds: 10)
    XCTAssert(app.otherElements["Balance 1,000"].exists)
    XCTAssert(app.otherElements["Login " + newLogin].exists)
  }
  
  func testAddVoucher() {
    app.otherElements["kind-coupon"].tap()
    let header = app.otherElements["Vouchers / Gift Cards (Tracked Manually)"]
    waitFor(element: header, seconds: 10)
    
    let programname = app.textFields["programname"]
    app.scrollDownToElement(element: programname, maxScrolls: 2)
    let completionText = "My Voucher Name"
    inputField(field: programname, value: completionText)
    
    let kind = app.otherElements["kind"]
    app.scrollDownToElement(element: kind, maxScrolls: 2)
    kind.tap()
    
    let picker = app.pickerWheels.firstMatch
    picker.adjust(toPickerWheelValue: "Hotels")
    picker.adjust(toPickerWheelValue: "Shopping")
    picker.adjust(toPickerWheelValue: "Other")
    XCTAssert(picker.value as? String == "Other")
    app.buttons["picker-kind-done"].tap()
    
    let typeid = app.otherElements["typeid"]
    typeid.tap()
    
    let typePicker = app.pickerWheels.firstMatch
    typePicker.adjust(toPickerWheelValue: "Coupon")
    typePicker.adjust(toPickerWheelValue: "Travel Voucher")
    XCTAssert(typePicker.value as? String == "Travel Voucher")
    app.buttons["picker-typeid-done"].tap()
    
    let cardnumber = app.textFields["cardnumber"]
    inputField(field: cardnumber, value: "1234567")
    
    let pin = app.textFields["pin"]
    inputField(field: pin, value: "1234")
    
    let value = app.textFields["value"]
    inputField(field: value, value: "1234567890")
    
    app.scrollDown()
    
    app.buttons["submit"].tap()
    
    waitFor(element: app.otherElements["My Voucher Name"], seconds: 10)
    XCTAssert(app.otherElements["Type Travel Voucher"].exists)
    XCTAssert(app.otherElements["Cert / Card / Voucher # 1234567"].exists)
    XCTAssert(app.otherElements["PIN / Redemption Code 1234"].exists)
    XCTAssert(app.otherElements["Coupon Value 1234567890"].exists)
  }
}
