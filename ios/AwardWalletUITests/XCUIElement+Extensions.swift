//
//  XCUIElement+Extensions.swift
//  AwardWalletUITests
//
//  Created by Aleksey Anikin on 03/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import XCTest

extension XCUIElement {
  /**
   Removes any current text in the field before typing in the new value
   - Parameter text: the text to enter into the field
   */
  func clearAndEnterText(text: String) {
    let stringValue = self.value as? String
    
    self.tap()
    
    if !(stringValue!.isEmpty) {
      let deleteString = String(repeating: XCUIKeyboardKey.delete.rawValue, count: stringValue!.count)
      self.typeText(deleteString)
    }
    
    self.typeText(text)
  }
  
  func forceTapElement() {
    if self.isHittable {
      self.tap()
    }
    else {
      let coordinate: XCUICoordinate = self.coordinate(withNormalizedOffset: CGVector(dx:0.0, dy:0.0))
      coordinate.tap()
    }
  }
}
