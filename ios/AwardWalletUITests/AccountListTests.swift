//
//  AccountListTests.swift
//  AwardWalletUITests
//
//  Created by Aleksey Anikin on 03/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import XCTest

class AccountListTests: AwardWalletUITests {
  
  override func setUp() {
    // Put setup code here. This method is called before the invocation of each test method in the class.
    
    // In UI tests it is usually best to stop immediately when a failure occurs.
    continueAfterFailure = false
    launchWithReset()
    doLogin()
    app.otherElements["passcode-promo-popup-close"].tap();
  }
  
  override func tearDown() {
    Springboard.deleteApp(appName: "AwardWallet")
  }
  
  func testPullToRefresh() {
    let firstCell = app.staticTexts["Airlines"]
    let start = firstCell.coordinate(withNormalizedOffset: CGVector(dx: 0, dy: 0))
    let finish = firstCell.coordinate(withNormalizedOffset: CGVector(dx: 0, dy: 6))
    start.press(forDuration: 0, thenDragTo: finish)
    XCTAssert(app.staticTexts["SYNCHRONIZING..."].exists)
    waitFor(element: app.staticTexts["SYNC WITH AWARDWALLET COMPLETE"], seconds: 15)
    waitFor(element: app.staticTexts["PULL DOWN TO SYNC WITH AWARDWALLET"], seconds: 5)
  }
  
  //  func testInfinityScroll(){
  //    print(app.debugDescription);
  //    app.scrollDown()
  //    print(app.debugDescription)
  //  }
  
  func testOpenBlogLink() {
    app.otherElements["blog-offer-link"].tap()
    let safari = XCUIApplication(bundleIdentifier: "com.apple.mobilesafari")
    _ = safari.wait(for: .runningForeground, timeout: 30)
    app.activate()
    _ = app.wait(for: .runningForeground, timeout: 5)
  }
  
  func testSearch() {
    let searchBar = app.textFields["searchBar"]
    setText("United", on: searchBar)
    waitFor(element: app.staticTexts["United Airlines (Mileage Plus)"], seconds: 1)
  }
  
  func testSearchNoResult() {
    let searchBar = app.textFields["searchBar"]
    setText(randomString(length: 5), on: searchBar)
    waitFor(element: app.staticTexts["The query string did not produce any results, please try changing what you are searching for"], seconds: 1)
  }
  
  func testOpenTotals() {
    app.scrollDown()
    app.otherElements["totals"].tap()
    waitFor(element: app.buttons["Accounts, back"], seconds: 1)
  }
  
  func testOpenAccountAdd() {
    app.scrollDown()
    app.buttons["account-add"].tap()
    waitFor(element: app.textFields["Find a program to add"], seconds: 1)
  }
  
  func testSwipeBack() {
    app.buttons["header-account-add"].tap()
    waitFor(element: app.textFields["Find a program to add"], seconds: 1)
    let swipeElement = app.staticTexts["Alternatively browse the list of supported programs:"]
    let start = swipeElement.coordinate(withNormalizedOffset: CGVector(dx: 0, dy: 0))
    let finish = swipeElement.coordinate(withNormalizedOffset: CGVector(dx: 6, dy: 0))
    start.press(forDuration: 0, thenDragTo: finish)
    waitFor(element: app.staticTexts["Accounts"], seconds: 1)
  }
  
  func testLeftMenu() {
    let drawer = app.otherElements["drawer-content"]
    print(drawer)
    XCTAssert(drawer.frame.origin.x == -230)
    let menuButton = app.buttons["header-back"]
    menuButton.tap()
    sleep(1)
    XCTAssert(drawer.frame.origin.x == 0)
  }
  
  func testSwipeLeftMenu() {
    let drawer = app.otherElements["drawer-content"]
    print(drawer)
    XCTAssert(drawer.frame.origin.x == -230)
    let firstCell = app.staticTexts["Airlines"]
    let start = firstCell.coordinate(withNormalizedOffset: CGVector(dx: 0, dy: 0))
    let finish = firstCell.coordinate(withNormalizedOffset: CGVector(dx: 6, dy: 0))
    start.press(forDuration: 0, thenDragTo: finish)
    sleep(1)
    XCTAssert(drawer.frame.origin.x == 0)
    app.swipeLeft()
    sleep(1)
    XCTAssert(drawer.frame.origin.x == -230)
  }
  
}
