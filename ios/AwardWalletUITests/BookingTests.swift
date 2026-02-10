//
//  BookingTests.swift
//  AwardWalletUITests
//
//  Created by Aleksey Anikin on 05/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import XCTest

class BookingTests: AwardWalletUITests {
  
  override func setUp() {
    continueAfterFailure = false
    launchWithReset()
    doLogin()
    app.otherElements["passcode-promo-popup-close"].tap();
    app.buttons["header-back"].tap()
    app.otherElements["menu-bookings"].tap();
  }
  
  override func tearDown() {
    Springboard.deleteApp(appName: "AwardWallet")
  }
  
  func testNoRequests() {
    XCTAssert(app.otherElements["no-requests"].exists)
    XCTAssertEqual(app.otherElements["header-title"].label, "Bookings 0")
  }
  
  func testAddNewRequest() {
    app.buttons["add-request"].tap()
    let predicate = NSPredicate(format: "label CONTAINS[c] %@", "Unfortunately at the moment we don't have a mobile-friendly version of our booking request form, so you can either use a computer to create a new booking request or you can submit a booking request here using our desktop interface.")
    let elementQuery = app.alerts.staticTexts.containing(predicate)
    XCTAssert(elementQuery.count > 0)
    app.alerts.buttons["Close"].tap()
    XCTAssert(elementQuery.count < 1)
    app.buttons["add-request"].tap()
    app.alerts.buttons["Add New Booking Request"].tap()
    waitFor(element: app.buttons["Bookings, back"], seconds: 1)
    waitFor(element: app.links["AwardWallet.com"], seconds: 30)
  }
  
  func testOpenRequest() {
    app.otherElements["booking-request-0"].tap()
    waitFor(element: app.buttons["Bookings, back"], seconds: 1)
    
  }
}
