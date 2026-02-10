//
//  RegistrationTests.swift
//  AwardWalletUITests
//
//  Created by Aleksey Anikin on 02/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import XCTest

class RegistrationTests: AwardWalletUITests {
  
  let newloginField = XCUIApplication().textFields["login"]
  let newPasswordField = XCUIApplication().secureTextFields["first"]
  let confirmPasswordField = XCUIApplication().secureTextFields["second"]
  let firstnameField = XCUIApplication().textFields["firstname"]
  let lastnameField = XCUIApplication().textFields["lastname"]
  let emailField = XCUIApplication().textFields["email"]
  let agreeField = XCUIApplication().otherElements["agree"]
  
  override func setUp() {
    continueAfterFailure = false
    launchWithReset()
  }
  
  override func tearDown() {
    Springboard.deleteApp(appName: "AwardWallet")
  }
  
  func _openRegistrationForm(){
    let button = app.buttons["register"]
    button.scrollToTop()
    button.tap()
    waitFor(element: app.buttons["submit"], seconds: 5)
  }
  
  func _completeForm(){
    let newPassword = randomString(length: 24)
    setText(newPassword, on: newPasswordField)
    setText(newPassword, on: confirmPasswordField)
    setText(randomString(length: 5), on: firstnameField)
    setText(randomString(length: 5), on: lastnameField)
    setText("aanikin" + "+" + randomString(length: 5) + "@awardwallet.com", on: emailField)
    app.otherElements["termsButton"].tap();
    let agreementText = "1. Agreement"
    waitFor(element: app.staticTexts[agreementText], seconds: 10)
    navigateBack()
    waitFor(element: agreeField, seconds: 1)
    agreeField.tap()
    app.buttons["submit"].tap();
  }
  
  func testRegister() {
    _openRegistrationForm()
    setText(login + randomString(length: 5), on: newloginField)
    _completeForm()
    waitFor(element: app.staticTexts["PIN code set up"], seconds: 10)
  }
  
  func testLoginExists() {
    _openRegistrationForm()
    setText(login, on: newloginField)
    _completeForm()
    waitFor(element: app.staticTexts["This user name is already taken"], seconds: 10)
  }
  
  func testEmailWrongFormat() {
    _openRegistrationForm()
    let newPassword = randomString(length: 12)
    setText(login + randomString(length: 5), on: newloginField)
    setText(newPassword, on: newPasswordField)
    setText(newPassword, on: confirmPasswordField)
    setText(randomString(length: 5), on: firstnameField)
    setText(randomString(length: 5), on: lastnameField)
    setText(randomString(length: 5), on: emailField)
    app.otherElements["termsButton"].tap();
    let agreementText = "1. Agreement"
    waitFor(element: app.staticTexts[agreementText], seconds: 10)
    navigateBack()
    waitFor(element: agreeField, seconds: 1)
    agreeField.tap()
    app.buttons["submit"].tap();
    waitFor(element: app.staticTexts["This is not a valid email address"], seconds: 10)
  }
  
  func testEmailExists() {
    _openRegistrationForm()
    let newPassword = randomString(length: 12)
    setText(login + randomString(length: 5), on: newloginField)
    setText(newPassword, on: newPasswordField)
    setText(newPassword, on: confirmPasswordField)
    setText(randomString(length: 5), on: firstnameField)
    setText(randomString(length: 5), on: lastnameField)
    setText(email, on: emailField)
    app.otherElements["termsButton"].tap();
    let agreementText = "1. Agreement"
    waitFor(element: app.staticTexts[agreementText], seconds: 10)
    navigateBack()
    waitFor(element: agreeField, seconds: 1)
    agreeField.tap()
    app.buttons["submit"].tap();
    waitFor(element: app.staticTexts["This email is already taken"], seconds: 10)
  }
  
  func _completePasswordComplexityForm(_ passwordLength: Int) {
    let newPassword = randomString(length: passwordLength)
    setText(login + randomString(length: 5), on: newloginField)
    setText(newPassword, on: newPasswordField)
    setText(newPassword, on: confirmPasswordField)
    setText(randomString(length: 5), on: firstnameField)
    setText(randomString(length: 5), on: lastnameField)
    setText("aanikin+"+randomString(length: 6)+"@awardwallet.com", on: emailField)
    app.otherElements["termsButton"].tap();
    let agreementText = "1. Agreement"
    waitFor(element: app.staticTexts[agreementText], seconds: 10)
    navigateBack()
    waitFor(element: agreeField, seconds: 1)
    agreeField.tap()
    app.buttons["submit"].tap();
  }
  
  func testPasswordComplexity() {
    _openRegistrationForm()
    _completePasswordComplexityForm(7)
    waitFor(element: app.staticTexts["Not all password requirements have been met"], seconds: 10)
    let newPassword = randomString(length: 12)
    newPasswordField.clearAndEnterText(text: newPassword)
    confirmPasswordField.clearAndEnterText(text: newPassword)
    app.buttons["submit"].tap();
    waitFor(element: app.staticTexts["Accounts"], seconds: 10)
  }
}
