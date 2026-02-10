//
//  ForgotPasswordTests.swift
//  AwardWalletUITests
//
//  Created by Aleksey Anikin on 02/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import XCTest

class ForgotPasswordTests: AwardWalletUITests {
  
  override func setUp() {
    continueAfterFailure = false
    launchWithReset();
    waitLaunchApp()
  }
  
  override func tearDown() {
    Springboard.deleteApp(appName: "AwardWallet")
  }
  
  func _submitForm(_ login: String) {
    let button = app.otherElements["forgot-password"]
    button.scrollToTop()
    button.tap()
    
    let submitButton = app.buttons["submit"];
    
    waitFor(element: submitButton, seconds: 5)
    
    let loginOrEmail = app.otherElements.textFields["loginOrEmail"];
    
    setText(login, on: loginOrEmail);
    
    submitButton.tap();
  }
  
  func testSubmitForm() {
    _submitForm(login)
    waitFor(element: app.staticTexts["A link to reset your password has been sent to the email that you have on your profile"], seconds: 10)
  }
  
  func testSubmitFormError() {
    _submitForm("test_" + randomString(length: 6))
    waitFor(element: app.staticTexts["There is no user with this email address or user name in our database"], seconds: 10)
  }
  
  func _openPasswordRecovery(){
    let safari = XCUIApplication(bundleIdentifier: "com.apple.mobilesafari")
    
    safari.launch();
    safari.otherElements["URL"].tap()
    safari.typeText(resetPasswordLink)
    safari.keyboards.buttons["Go"].tap()
    waitFor(element: safari.buttons["OPEN"], seconds: 15)
    safari.swipeDown();
    safari.buttons["OPEN"].tap()
  }
  
  func _submitChangePasswordForm(_ password: String, _ secondPassword: String){
    let first = app.secureTextFields["first"]
    let second = app.secureTextFields["second"]
    waitFor(element: first, seconds: 5)
    setText(password, on: first)
    setText(secondPassword, on: second)
    app.buttons["submit"].tap()
  }
  
  func testChangePasswordFail(){
    _openPasswordRecovery()
    _submitChangePasswordForm(password, password)
    let errorTxt = "Your new password should not be the same as your old password."
    let errorMsg = app.staticTexts[errorTxt]
    waitFor(element: errorMsg, seconds: 5)
  }
  
  func testChangePassword(){
    _openPasswordRecovery()
    let newPassword = String(password.reversed());
    _submitChangePasswordForm(newPassword, newPassword)
    let successText = "Your password has been reset. Now you can login using \"" + login.lowercased() + "\" as your user name and your new password."
    let successMsg = app.staticTexts[successText]
    waitFor(element: successMsg, seconds: 5)
  }
  
  func testOpenDeepLink() {
    let messageApp = XCUIApplication(bundleIdentifier: "com.apple.MobileSMS")
    messageApp.terminate()
    messageApp.activate()
    messageApp.cells.staticTexts["Kate Bell"].tap()
    messageApp.textFields["iMessage"].tap()
    messageApp.typeText(resetPasswordLink)
    messageApp/*@START_MENU_TOKEN@*/.buttons["sendButton"]/*[[".otherElements[\"MessageEntryView\"]",".buttons[\"Send\"]",".buttons[\"sendButton\"]"],[[[-1,2],[-1,1],[-1,0,1]],[[-1,2],[-1,1]]],[0]]@END_MENU_TOKEN@*/.tap()
    messageApp.links["com.apple.messages.URLBalloonProvider"].tap()
    waitFor(element: app.secureTextFields["first"], seconds: 10)
  }
}
