#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>

#import <Firebase.h>
#import <RNCPushNotificationIOS.h>
#import <UserNotifications/UserNotifications.h>
#import <RNQuickAction/RNQuickActionManager.h>
#import <React/RCTLinkingManager.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <Bugsnag/Bugsnag.h>
#import "RNBootSplash.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "GooglePlaces/GooglePlaces.h"

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{


  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  [FBSDKApplicationDelegate.sharedInstance initializeSDK];
  [FBSDKSettings.sharedSettings setAdvertiserTrackingEnabled:YES];

  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];

  // Define UNUserNotificationCenter
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  BugsnagConfiguration *config = [BugsnagConfiguration loadConfig];
  config.enabledErrorTypes.cppExceptions = YES;
  config.enabledErrorTypes.machExceptions = YES;
  config.enabledErrorTypes.ooms = YES;
  config.enabledErrorTypes.signals = YES;
  config.enabledErrorTypes.unhandledExceptions = YES;
  config.enabledErrorTypes.unhandledRejections = NO;
  [Bugsnag startWithConfiguration:config];

  [GMSPlacesClient provideAPIKey:@"AIzaSyAmVVT4pcDu9i7JRz3TlzOFKs1KZzqnGOw"];


  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.moduleName = @"AwardWallet";
  self.initialProps = @{};
  [super application:application didFinishLaunchingWithOptions:launchOptions];
  if (@available(iOS 13.0, *)) {
    self.window.rootViewController.view.backgroundColor = [UIColor colorNamed:@"backgroundColor"];
  } else {
    self.window.rootViewController.view.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  }
  [RNBootSplash initWithStoryboard:@"Launch Screen" rootView:self.window.rootViewController.view];

   return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}

// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}
// @implementation AppDelegate

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                         openURL:url
                                               sourceApplication:sourceApplication
                                                      annotation:annotation];
}

- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL succeeded)) completionHandler {
  [RNQuickActionManager onQuickActionPress:shortcutItem completionHandler:completionHandler];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray *))restorationHandler
{
  BOOL handled = NO;
  //  BOOL handled = [[RNFirebaseLinks instance] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];

  if (!handled) {
    handled = [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
  }

  return handled;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
     return YES;
  }

  BOOL handled = [RNGoogleSignin application:application openURL:url options:options];

  return handled;
}

//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

@end
