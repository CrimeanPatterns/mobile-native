//
//  AwardWalletUITests.swift
//  AwardWalletUITests
//
//  Created by Aleksey Anikin on 02/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import XCTest

var login = "AAnikin1"
var password = "Awdeveloper12"
var accountId = 0
var segmentId = ""
var appLocale = ""
var resetPasswordLink = "https://awardwallet.com/user/change-password-feedback/626363/47982075449e958a607665f30ca2d2ed"
var email = "aanikin@awardwallet.com"

class AwardWalletUITests: XCTestCase {
  let app:XCUIApplication = XCUIApplication()

  let loginField = XCUIApplication().otherElements.textFields["login-field"];
  let passwordField = XCUIApplication().otherElements.secureTextFields["password-field"];
  let loginButton = XCUIApplication().buttons["login"];
  
  override func setUp() {
    // In UI tests it is usually best to stop immediately when a failure occurs.
    continueAfterFailure = false
    launchWithReset()
  }
  
  override func tearDown() {
    Springboard.deleteApp(appName: "AwardWallet")
  }
  
  func launch() {
    XCUIApplication().launch()
  }
  
  func launchWithReset() {
    XCUIApplication().launchArguments = ["-StartFromCleanState", "YES"]
    XCUIApplication().launch()
  }
  
  func doLogin() {
    doLoginWithCredentials(login, password)
    
    waitFor(element: app.otherElements["passcode-promo-popup-close"], seconds: 10)
  }
  
  func doLoginWithCredentials(_ login: String, _ password: String) {
    waitLaunchApp()
    
    setText(login, on: loginField);
    setText(password, on: passwordField);
    
    loginButton.tap();
  }
  
  func setText(_ text: String, on element: XCUIElement?) {
    if let element = element {
      element.tap()
      app.typeText(text)
    }
  }
  
  func waitFor(element:XCUIElement, seconds waitSeconds:Double) {
    let exists = NSPredicate(format: "exists == 1")
    expectation(for: exists, evaluatedWith: element, handler: nil)
    waitForExpectations(timeout: waitSeconds, handler: nil)
  }
  
  func waitLaunchApp() {
    waitFor(element: loginField, seconds: 10)
  }
  
  func navigateBack(){
    app.buttons["header-back"].tap();
  }
  
  func randomString(length: Int) -> String {
    let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return String((0..<length).map{ _ in letters.randomElement()! })
  }
  
  func inputField(field: XCUIElement, value: String) {
    field.clearAndEnterText(text: value)
    XCTAssert(field.value as? String == value)
  }
  
  func testSwitcher(_ switchName: String, _ state: Bool) {
    let switcher = app.switches[switchName]
    waitFor(element: switcher, seconds: 5)
    XCTAssertEqual(switcher.isSelected, !state)
    switcher.tap()
    XCTAssertEqual(switcher.isSelected, state)
  }
  
  func openMenu(_ category: String) {
    app.buttons["header-menu"].tap()
    app.otherElements["menu-" + category].tap()
    sleep(1)
  }
}
