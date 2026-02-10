//
//  AuthTests.swift
//  AwardWalletUITests
//
//  Created by Aleksey Anikin on 02/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import XCTest

class AuthTests: AwardWalletUITests {
  
  override func setUp() {
    continueAfterFailure = false
    launchWithReset()
  }
  
  override func tearDown() {
    Springboard.deleteApp(appName: "AwardWallet")
  }

  func testSuccesLogin() {
    doLogin();
    XCTAssert(app.staticTexts["Accounts"].exists)
  }
  
  func testFailedLogin(){
    let randomStr = randomString(length: 6)
    doLoginWithCredentials("test_" + randomStr, randomStr + "_test");
    waitFor(element: app.alerts.element.staticTexts["Invalid user name or password"], seconds: 5)
  }
  
}
