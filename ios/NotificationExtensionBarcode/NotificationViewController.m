//
//  NotificationViewController.m
//  NotificationExtensionBarcode
//
//  Created by Aleksey Anikin on 18/08/2017.
//
//

#import "NotificationViewController.h"
#import <UserNotifications/UserNotifications.h>
#import <UserNotificationsUI/UserNotificationsUI.h>
#import "BarCodeKit/BarCodeKit.h"
#import "AccountDetailsCell.h"
#import "AccountDetailsCellBalance.h"

#define UIColorFromRGB(rgbValue) [UIColor colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 green:((float)((rgbValue & 0xFF00) >> 8))/255.0 blue:((float)(rgbValue & 0xFF))/255.0 alpha:1.0]
#define grayBorder UIColorFromRGB(0x828b99)
#define grayColor UIColorFromRGB(0x808080)
#define greenColor UIColorFromRGB(0x4dbfa2)
#define blueColor UIColorFromRGB(0x4684c4)

@interface NotificationViewController () <UNNotificationContentExtension, UITableViewDelegate, UITableViewDataSource>
@property IBOutlet UILabel *displayName;
@property IBOutlet UIImageView *logoView;
@property IBOutlet UIImageView *barcodeImageView;
@property IBOutlet UILabel *accountNumber;
@property IBOutlet UIView *cardView;
@property IBOutlet UIView *headerView;
@property IBOutlet UITableView *accountDetails;
@property NSArray *tableData;
@property BOOL once;
@end

@implementation NotificationViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.headerView setBackgroundColor:[UIColor whiteColor]];
    
    self.displayName.textColor = [UIColor blackColor];
    self.displayName.lineBreakMode = NSLineBreakByTruncatingTail;
    [self.displayName setFont:[UIFont fontWithName: @"OpenSans" size: 21.0f]];
    [self.displayName setNumberOfLines:4];

    [self.accountNumber setFont:[UIFont fontWithName: @"OpenSans" size: 17.0f]];
    [self.accountNumber setTextColor:grayColor];
    
    [self.cardView.layer setCornerRadius:10.0];
    [self.cardView.layer setBorderWidth:1.0];
    [self.cardView.layer setBorderColor:grayBorder.CGColor];
    [self.cardView.layer setMasksToBounds:YES];
    
    self.accountDetails.delegate = self;
    self.accountDetails.dataSource = self;
    self.accountDetails.layoutMargins = UIEdgeInsetsZero;
    self.accountDetails.contentInset = UIEdgeInsetsMake(0, 0, 0, 0);
    self.accountDetails.tableFooterView = [[UIView alloc] initWithFrame:CGRectZero];
    self.accountDetails.tableHeaderView = [[UIView alloc] initWithFrame:CGRectZero];

    self.tableData = @[];
    self.once = 0;
}

- (void)didReceiveNotification:(UNNotification *)notification {
    CGRect bounds = self.barcodeImageView.layer.bounds;
    NSDictionary *userInfo = notification.request.content.userInfo;
    
    if(userInfo[@"properties"] && self.once == 0)
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            self.tableData = userInfo[@"properties"];
            [self.accountDetails reloadData];
            CGFloat bottomPadding = 47 * [self.tableData count];
            if([self.tableData count] < 3)
            {
                bottomPadding += 5;
            }
            self.preferredContentSize = CGSizeMake(self.view.bounds.size.width, (self.cardView.bounds.size.height + 20) + bottomPadding);
        });
        self.once = 1;
    }
    
    UIFont *fontDisplayName = [UIFont fontWithName: @"OpenSans" size: 21.0f];
    NSDictionary *displayName = [NSDictionary dictionaryWithObject: fontDisplayName forKey:NSFontAttributeName];
    NSMutableAttributedString *displayNameStr = [[NSMutableAttributedString alloc] initWithString:userInfo[@"displayName"] attributes: displayName];
    
    UIFont *fontAccountOwner = [UIFont fontWithName: @"OpenSans" size: 17.0f];
    NSDictionary *accountOwner = [NSDictionary dictionaryWithObject: fontAccountOwner forKey:NSFontAttributeName];
    NSMutableAttributedString *accountOwnerStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"\n%@", [userInfo[@"userName"] uppercaseString]] attributes: accountOwner];
    [displayNameStr appendAttributedString:accountOwnerStr];
    
    self.displayName.attributedText = displayNameStr;
    
    if(userInfo[@"providerBgColor"])
    {
        [self.headerView setBackgroundColor:[self colorWithHexString:userInfo[@"providerBgColor"]]];
    }
    
    if(userInfo[@"providerFontColor"])
    {
        [self.displayName setTextColor:[self colorWithHexString:userInfo[@"providerFontColor"]]];
    }
    
    UIImage *providerLogo;
    if(userInfo[@"providerLogo"] && userInfo[@"providerLogo"] != [NSNull null])
        providerLogo = [UIImage imageNamed:userInfo[@"providerLogo"]];
    
    if(providerLogo)
    {
        [self.logoView setImage:providerLogo];
    }else{
        CGRect displayNameFrame = self.displayName.frame;
        displayNameFrame.size.width += self.logoView.frame.size.width;
        self.displayName.frame = displayNameFrame;
    }
    
    BCKCode *_barcodeObject;
    NSError *error;
    UIImage *image;
    
    if([userInfo[@"barCodeType"] isEqual:@"PDF_417"] || [userInfo[@"barCodeType"] isEqual:@"PDF417"]){
        image = [self generatorCodeWithContent:userInfo[@"barCodeData"] imageSize:CGSizeMake(bounds.size.width, bounds.size.height)];
    }else{
        _barcodeObject = [[[self classFromString:userInfo[@"barCodeType"]] alloc] initWithContent:userInfo[@"barCodeData"] error:&error];
        if(_barcodeObject){
            image = [UIImage imageWithBarCode:_barcodeObject withSize:CGSizeMake(bounds.size.width, bounds.size.height)];
        }
    }
    [self.accountNumber setText:userInfo[@"barCodeData"]];
    [self.barcodeImageView setImage:image];
    
    _barcodeObject = nil;
    image = nil;
}

#pragma Account Details
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.tableData count];
}

- (UIView *)tableView:(UITableView *)tableView viewForFooterInSection:(NSInteger)section
{
    return [UIView new];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *tableId = @"AccountDetailsCell";
    NSDictionary *rowData = [self.tableData objectAtIndex:indexPath.row];
    if(rowData[@"type"] && [rowData[@"type"] isEqual:@"balance"])
    {
        AccountDetailsCellBalance *cell = (AccountDetailsCellBalance *)[tableView dequeueReusableCellWithIdentifier:@"AccountDetailsCellBalance"];
        if (cell == nil)
        {
            NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"AccountDetailsCellBalance" owner:self options:nil];
            cell = [nib objectAtIndex:0];
        }
        [cell.propertyValue setFont:[UIFont fontWithName: @"OpenSans-Bold" size: 15.0f]];
        [cell.propertyValue setText:[rowData valueForKey:@"value"]];
        
        [cell setEditing:NO];
        [cell setAccessoryType: UITableViewCellAccessoryNone];
        [cell setAccessoryView:nil];
        cell.layoutMargins = UIEdgeInsetsZero;
        cell.preservesSuperviewLayoutMargins = NO;
        
        cell.propertyLabel.text = [rowData valueForKey:@"name"];
        [cell.propertyLabel setFont:[UIFont fontWithName: @"OpenSans" size: 15.0f]];
//        cell.propertyLabel.textColor = grayColor;
        
        UIFont *balanceFont = [UIFont fontWithName: @"OpenSans-Bold" size: 15.0f];
        NSDictionary *balance = [NSDictionary dictionaryWithObject: balanceFont forKey:NSFontAttributeName];
        NSMutableAttributedString *balanceRow = [[NSMutableAttributedString alloc] initWithString:[rowData valueForKey:@"value"] attributes: balance];
        
        UIFont *changesFont = [UIFont fontWithName: @"OpenSans" size: 11.0f];
        NSDictionary *changes = [NSDictionary dictionaryWithObject: changesFont forKey:NSFontAttributeName];
        
        
        if(rowData[@"change"])
        {
            UIColor *changesColor;
            if([[rowData valueForKey:@"change"] intValue] > 0)
            {
                changesColor = [UIColor colorWithCGColor:greenColor.CGColor];
                [cell.propertyImage setImage:[UIImage imageNamed:@"up"]];
            }else{
                changesColor = [UIColor colorWithCGColor:blueColor.CGColor];
                [cell.propertyImage setImage:[UIImage imageNamed:@"down"]];
            }
            
            NSMutableAttributedString *changesRow = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"\n%@", [rowData valueForKey:@"change"]] attributes: changes];
            [changesRow addAttribute:NSForegroundColorAttributeName value:changesColor range:NSMakeRange(0, [[rowData valueForKey:@"change"] length] + 1)];
        
            [balanceRow appendAttributedString: changesRow];
        }else{
            CGRect propertyFrame = cell.propertyValue.frame;
            cell.propertyValue.frame = CGRectMake(propertyFrame.origin.x, propertyFrame.origin.y, propertyFrame.size.width + cell.propertyImage.frame.size.width + 10, propertyFrame.size.height);
            [cell.propertyImage setHidden:YES];
        }
        cell.propertyValue.attributedText = balanceRow;
        
        [cell.propertyValue setNumberOfLines:2];
        
        return cell;
    } else {
        
        AccountDetailsCell *cell = (AccountDetailsCell *)[tableView dequeueReusableCellWithIdentifier:tableId];
        if (cell == nil)
        {
            NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"AccountDetailsCell" owner:self options:nil];
            cell = [nib objectAtIndex:0];
        }
        
        [cell.propertyValue setFont:[UIFont fontWithName: @"OpenSans-Bold" size: 15.0f]];
        [cell.propertyValue setText:[rowData valueForKey:@"value"]];
        
        [cell setEditing:NO];
        [cell setAccessoryType: UITableViewCellAccessoryNone];
        [cell setAccessoryView:nil];
        cell.layoutMargins = UIEdgeInsetsZero;
        cell.preservesSuperviewLayoutMargins = NO;
        
        cell.propertyLabel.text = [rowData valueForKey:@"name"];
        [cell.propertyLabel setFont:[UIFont fontWithName: @"OpenSans" size: 15.0f]];
//        cell.propertyLabel.textColor = grayColor;
        
        return cell;
    }
    
}

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
    return NO;
}


#pragma mark - Other
- (UIImage *)generatorCodeWithContent:(NSString *)content imageSize:(CGSize)size
{
    CIFilter *filter = [CIFilter filterWithName:@"CIPDF417BarcodeGenerator"];
    
    NSData  *dataContent = [content dataUsingEncoding:NSUTF8StringEncoding];
    [filter setValue:dataContent forKey:@"inputMessage"];
    [filter setValue:@"L" forKey:@"inputCorrectionLevel"];
    
    CIImage *qrCodeImage = [filter outputImage];
    CGRect extent = CGRectIntegral(qrCodeImage.extent);
    
    CGFloat scale = MIN(size.width/CGRectGetWidth(extent), size.height/CGRectGetHeight(extent));
    size_t width  = CGRectGetWidth(extent) * scale;
    size_t height = CGRectGetHeight(extent) * scale;
    
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceGray();
    
    CGContextRef bitmapRef = CGBitmapContextCreate(nil, width, height, 8, 0, colorSpace, (CGBitmapInfo)kCGImageAlphaNone);
    CIContext *context = [CIContext contextWithOptions:nil];
    CGImageRef bitmapImage = [context createCGImage:qrCodeImage fromRect:extent];
    
    CGContextSetInterpolationQuality(bitmapRef, kCGInterpolationNone);
    CGContextScaleCTM(bitmapRef, scale, scale);
    CGContextDrawImage(bitmapRef, extent, bitmapImage);
    
    CGImageRef scaledImage = CGBitmapContextCreateImage(bitmapRef);
    UIImage *imgResult = [UIImage imageWithCGImage:scaledImage];
    
    CGColorSpaceRelease(colorSpace);
    CGContextRelease(bitmapRef);
    CGImageRelease(bitmapImage);
    
    return imgResult;
}
- (Class)classFromString:(NSString *)barcodeFromat {
    if([barcodeFromat  isEqual: @"EAN_8"]) return NSClassFromString(@"BCKEAN8Code");
    if([barcodeFromat  isEqual: @"EAN_13"]) return NSClassFromString(@"BCKEAN13Code");
    if([barcodeFromat  isEqual: @"UPC"]) return NSClassFromString(@"BCKUPCACode");
    if([barcodeFromat  isEqual: @"UPC_A"]) return NSClassFromString(@"BCKUPCACode");
    if([barcodeFromat  isEqual: @"UPC_E"]) return NSClassFromString(@"BCKUPCECode");
    if([barcodeFromat  isEqual: @"CODE_11"]) return NSClassFromString(@"BCKCode11Code");
    if([barcodeFromat  isEqual: @"CODE_39"]) return NSClassFromString(@"BCKCode39Code");
    if([barcodeFromat  isEqual: @"CODE_93"]) return NSClassFromString(@"BCKCode93Code");
    if([barcodeFromat  isEqual: @"CODE_128"]) return NSClassFromString(@"BCKCode128Code");
    if([barcodeFromat  isEqual: @"CODABAR"]) return NSClassFromString(@"BCKCodabarCode");
    if([barcodeFromat  isEqual: @"MSI"]) return NSClassFromString(@"BCKMSICode");
    if([barcodeFromat  isEqual: @"STD_25"]) return NSClassFromString(@"BCKStandard2of5Code");
    if([barcodeFromat  isEqual: @"INT_25"]) return NSClassFromString(@"BCKInterleaved2of5Code");
    if([barcodeFromat  isEqual: @"ITF"]) return NSClassFromString(@"BCKInterleaved2of5Code");
    return NSClassFromString(@"BCKCode39Code");
}


- (UIColor *)colorWithHexString:(NSString *)hexString {
    unsigned rgbValue = 0;
    NSScanner *scanner = [NSScanner scannerWithString:hexString];
    [scanner setScanLocation:1]; // bypass '#' character
    [scanner scanHexInt:&rgbValue];
    
    return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0 green:((rgbValue & 0xFF00) >> 8)/255.0 blue:(rgbValue & 0xFF)/255.0 alpha:1.0];
}

@end
