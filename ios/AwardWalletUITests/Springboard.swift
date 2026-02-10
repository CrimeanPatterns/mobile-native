import XCTest

class Springboard {
  
  static let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
  
  class func deleteApp(appName: String) {
    XCUIApplication().terminate()
    
    // Force delete the app from the springboard
    let icon = springboard.icons[appName]
    if icon.exists {
      icon.press(forDuration: 2.0)
      
      icon.buttons["DeleteButton"].tap()
      sleep(2)
      springboard.alerts["Delete “\(appName)”?"].buttons["Delete"].tap()
      sleep(2)
      
      XCUIDevice.shared.press(.home)
    }
  }
}

