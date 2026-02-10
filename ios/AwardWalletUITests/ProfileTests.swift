//
//  ProfileTests.swift
//  AwardWalletUITests
//
//  Created by Aleksey Anikin on 08/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import XCTest

class ProfileTests: AwardWalletUITests {
  
  let submit = XCUIApplication().buttons["submit"]
  let setupPincode = XCUIApplication().otherElements["pincode-setup"]
  let removePincode = XCUIApplication().otherElements["pincode-remove"]
  
  override func setUp() {
    continueAfterFailure = false
    launchWithReset()
    doLogin()
    app.otherElements["passcode-promo-popup-close"].tap();
    openMenu("profile")
  }
  
  override func tearDown() {
    Springboard.deleteApp(appName: "AwardWallet")
  }
  
  func testProfile() {
    XCTAssert(app.otherElements["profile-header"].staticTexts["A A"].exists)
    XCTAssert(app.otherElements["profile-header"].staticTexts["aanikin+a1@awardwallet.com"].exists)
  }
  
  func testVerifyEmail() {
    let flashmessage = app.otherElements["flashMessage"]
    waitFor(element: flashmessage, seconds: 1)
    flashmessage.tap()
    let predicate = NSPredicate(format: "label CONTAINS[c] %@", "We have sent you a message to the email address you specified in your profile. Please follow the link in that message to verify your email.")
    let elementQuery = app.staticTexts.containing(predicate)
    XCTAssertEqual(elementQuery.count, 1)
  }
  
  func testPullToRefresh() {
    let firstCell = app.otherElements["profile-header"]
    let start = firstCell.coordinate(withNormalizedOffset: CGVector(dx: 0, dy: 0))
    let finish = firstCell.coordinate(withNormalizedOffset: CGVector(dx: 0, dy: 6))
    start.press(forDuration: 0, thenDragTo: finish)
    XCTAssert(app.staticTexts["SYNCHRONIZING..."].exists)
    waitFor(element: app.staticTexts["SYNC WITH AWARDWALLET COMPLETE"], seconds: 15)
    waitFor(element: app.staticTexts["PULL DOWN TO SYNC WITH AWARDWALLET"], seconds: 5)
  }
  
  func testChangePersonalInformation() {
    let newUserLogin = "aanikin1test"
    let newFirstName = "B"
    let newLastName = "B"
    XCTAssertEqual(app.otherElements["textProperty-7"].label, "User name " + login.lowercased())
    //XCTAssertEqual(app.otherElements["textProperty-8"].label, "Password ••••••••" /*+ String(repeating: "•", count: password.count)*/)
    XCTAssertEqual(app.otherElements["textProperty-9"].label, "First name " + "A")
    XCTAssertEqual(app.otherElements["textProperty-10"].label, "Last name " + "A")
    //XCTAssertEqual(app.otherElements["textProperty-11"].label, "Email " + "aanikin+a1@awardwallet.com")
    app.otherElements["textProperty-7"].tap()
    waitFor(element: submit, seconds: 10)
    XCTAssertEqual(app.otherElements["header-title"].label, "Edit Personal Info")
    inputField(field: app.textFields["login"], value: newUserLogin)
    inputField(field: app.textFields["firstname"], value: newFirstName)
    inputField(field: app.textFields["lastname"], value: newLastName)
    app.scrollDown()
    submit.tap()
    waitFor(element: app.staticTexts["SYNC WITH AWARDWALLET COMPLETE"], seconds: 15)
    XCTAssertEqual(app.otherElements["textProperty-7"].label, "User name " + newUserLogin)
    XCTAssertEqual(app.otherElements["textProperty-9"].label, "First name " + newFirstName)
    XCTAssertEqual(app.otherElements["textProperty-10"].label, "Last name " + newLastName)
  }
  
  func testChangeEmail() {
    let newUserEmail = "aanikin+a2@awardwallet.com"
    XCTAssertEqual(app.otherElements["textProperty-11"].label, "Email " + "aanikin+a1@awardwallet.com")
    app.otherElements["textProperty-11"].tap()
    waitFor(element: submit, seconds: 10)
    XCTAssert(app.otherElements["Change email"].exists)
    setText(password, on: app.secureTextFields["password"])
    inputField(field: app.textFields["email"], value: newUserEmail)
    app.scrollDown()
    submit.tap()
    waitFor(element: app.staticTexts["SYNC WITH AWARDWALLET COMPLETE"], seconds: 15)
    XCTAssertEqual(app.otherElements["textProperty-11"].label, "Email " + newUserEmail)
  }
  
  func testChangeRegionalSettings() {
    let newUserLanguage = "Русский"
    let newRegion = "United States"
    XCTAssertEqual(app.otherElements["textProperty-13"].label, "Language English")
    XCTAssertEqual(app.otherElements["textProperty-14"].label, "Country Auto")
    app.otherElements["textProperty-13"].tap()
    waitFor(element: submit, seconds: 10)
    XCTAssert(app.otherElements["Regional Settings"].exists)
    let hint = app.staticTexts["region hint"]
    XCTAssertEqual(hint.label, "1,000.00 | 1/31/19 | 2:30 PM")
    app.otherElements["language"].tap()
    let picker = app.pickerWheels.firstMatch
    picker.adjust(toPickerWheelValue: newUserLanguage)
    XCTAssert(picker.value as? String == newUserLanguage)
    app.buttons["picker-language-done"].tap()
    sleep(2)
    XCTAssertEqual(hint.label, "1 000,00 | 31.01.2019 | 14:30")
    //    app.otherElements["region"].tap()
    //    picker.adjust(toPickerWheelValue:newRegion)
    //    XCTAssertEqual(picker.value as? String, newRegion)
    //app.buttons["picker-region-done"].tap()
    //XCTAssertEqual(hint.label, "1,000.00 | 1/31/19 | 2:30 PM")
    app.scrollDown()
    submit.tap()
    waitFor(element: app.staticTexts["СИНХРОНИЗАЦИЯ ЗАВЕРШЕНА"], seconds: 15)
    XCTAssertEqual(app.otherElements["textProperty-13"].label, "Язык " + newUserLanguage)
    XCTAssertEqual(app.otherElements["textProperty-14"].label, "Страна Авто")
  }
  
  func isSelected(_ num: Int, _ selected: Bool) {
    let checklistItem = app.otherElements["checklistItem-" + String(num)]
    XCTAssert(checklistItem.exists)
    XCTAssertEqual(checklistItem.isSelected, selected)
  }
  
  func checkPushNotification(_ selected: Bool, _ excluded: Array<Int>) {
    var i = 17
    while i < 30 {
      if !excluded.contains(i) {
        isSelected(i, selected)
      }
      i += 1
    }
  }
  
  func testDisableAllPushNotifications() {
    let rewardsExpr = app.otherElements["checklistItem-17"]
    checkPushNotification(true,  [20, 25, 28])
    rewardsExpr.tap()
    let disableAll = app.switches["mpDisableAll"]
    waitFor(element: disableAll, seconds: 5)
    XCTAssertEqual(disableAll.isSelected, false)
    disableAll.tap()
    XCTAssertEqual(disableAll.isSelected, true)
    app.buttons["My Profile, back"].tap()
    sleep(5)
    //waitFor(element: app.staticTexts["SYNC WITH AWARDWALLET COMPLETE"], seconds: 15)
    checkPushNotification(false,  [20, 25, 28])
  }
  
  func testChangePushNotifications() {
    let rewardsExpr = app.otherElements["checklistItem-17"]
    isSelected(17, true)
    isSelected(18, true)
    isSelected(19, true)
    rewardsExpr.tap()
    testSwitcher("mpExpire", false)
    testSwitcher("mpRewardsActivity", false)
    testSwitcher("mpRetailCards", false)
    app.buttons["My Profile, back"].tap()
    sleep(5)
    //waitFor(element: app.staticTexts["SYNC WITH AWARDWALLET COMPLETE"], seconds: 15)
    isSelected(17, false)
    isSelected(18, false)
    isSelected(19, false)
  }
  
  func enterPincode(){
    app.otherElements["button 1"].tap()
    app.otherElements["button 2"].tap()
    app.otherElements["button 3"].tap()
    app.otherElements["button 4"].tap()
  }
  
  func testSetupPincode(){
    XCTAssert(setupPincode.exists)
    XCTAssert(!removePincode.exists)
    setupPincode.tap()
    let code = app.otherElements["passcode code"]
    XCTAssertEqual(code.label, "")
    enterPincode()
    XCTAssertEqual(code.label, "1234")
    enterPincode()
    sleep(1)
    XCTAssert(removePincode.exists)
  }
  
  func testRemovePincode(){
    testSetupPincode()
    removePincode.tap()
    enterPincode()
    sleep(1)
    XCTAssert(setupPincode.exists)
    XCTAssert(!removePincode.exists)
  }
}
