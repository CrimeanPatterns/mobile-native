//
//  TimelineTests.swift
//  AwardWalletUITests
//
//  Created by Aleksey Anikin on 05/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import XCTest

class TimelineTests: AwardWalletUITests {
  
  override func setUp() {
    continueAfterFailure = false
    launchWithReset()
    doLogin()
    app.otherElements["passcode-promo-popup-close"].tap();
    app.buttons["header-menu"].tap()
    let menuTimeline = app.otherElements["menu-timeline"]
    
    if menuTimeline.exists {
      menuTimeline.tap();
    }
    
    let menuTravelers = app.otherElements["menu-travelers"]
    
    if menuTravelers.exists {
      menuTravelers.tap();
    }
  }
  
  override func tearDown() {
    Springboard.deleteApp(appName: "AwardWallet")
  }
  
  func testPullToRefresh() {
    let firstCell = app.otherElements["timeline-segment-E.235983"]
    let start = firstCell.coordinate(withNormalizedOffset: CGVector(dx: 0, dy: 0))
    let finish = firstCell.coordinate(withNormalizedOffset: CGVector(dx: 0, dy: 6))
    start.press(forDuration: 0, thenDragTo: finish)
    XCTAssert(app.staticTexts["SYNCHRONIZING..."].exists)
    waitFor(element: app.staticTexts["SYNC WITH AWARDWALLET COMPLETE"], seconds: 15)
    waitFor(element: app.staticTexts["PULL DOWN TO SYNC WITH AWARDWALLET"], seconds: 5)
  }
  
  func testOneTravelerNoTrips() {
    let norequests = app.staticTexts["Currently you have no trips added to your profile"]
    waitFor(element: norequests, seconds: 1)
    XCTAssertEqual(app.otherElements["header-title"].label, "A A 0")
    XCTAssert(app.buttons["header-menu"].exists)
    //You can link your mailbox and we will import all of your travel reservations automatically (alternatively you can just forward your reservations to  aanikin1@AwardWallet.com  to get them added to your travel timeline)
  }
  
  func testOneTravelerWithTrips() {
    XCTAssert(app.otherElements["Meeting in dining room"].exists)
    XCTAssertEqual(app.otherElements["header-title"].label, "A A 0")
    XCTAssert(app.buttons["header-menu"].exists)
  }
  
  func testManyTravelers(){
    XCTAssert(app.otherElements["Trips 0"].exists)
    XCTAssert(app.otherElements["Travelers 2"].exists)
  }
}
