//
//  AppDelegate.m
//  Demo
//
//  Created by Eric on 2017/12/27.
//  Copyright © 2017年 Eric. All rights reserved.
//

#import "AppDelegate.h"
#import <React/RCTRootView.h>

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    RCTRootView *rootView = [self loadJSViewWithLaunchOptions:launchOptions];
    
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;
    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];
    return YES;
}


- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
}


- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}


- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}


- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

#pragma mark - 启动项

- (RCTRootView *)loadJSViewWithLaunchOptions:(NSDictionary *)launchOptions {
    NSString *bundlePath = [NSString stringWithFormat:@"http://%@:8081/%@.bundle?platform=ios&dev=true", @"10.235.156.151", @"demo/mobile/rn/index"];
    NSURL *bundleURL = [NSURL URLWithString:bundlePath];
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:bundleURL
                                                        moduleName:@"Demo"
                                                 initialProperties:nil
                                                     launchOptions:launchOptions];
    return rootView;
}



@end
