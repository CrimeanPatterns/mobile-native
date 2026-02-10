//
//  UIImage+BarCodeKit.m
//  BarCodeKit
//
//  Created by Oliver Drobnik on 8/17/13.
//  Copyright (c) 2013 Oliver Drobnik. All rights reserved.
//

#import "UIImage+BarCodeKit.h"
#import "BCKCode.h"
#import "BCKCodeCharacter.h"


@implementation UIImage (BarCodeKit)

+ (UIImage *)imageWithBarCode:(BCKCode *)barCode withSize:(CGSize)size
{
    UIGraphicsBeginImageContextWithOptions(size, NO, 0);
    CGContextRef context = UIGraphicsGetCurrentContext();    
    CGContextSaveGState(context);

    BCKMutableBarString	*tmpString = [BCKMutableBarString string];
    
    for (BCKCodeCharacter *oneCharacter in [barCode codeCharacters])
    {
        [tmpString appendBarString:[oneCharacter barString]];
    }
    
    NSString *barcodeStr = BCKBarStringToNSString(tmpString);
    
    CGFloat multiplier =  1.25f;
    
    CGFloat barHeight = size.height;
    
    int narrow = 0, wide=0;
    
    for (uint i=0; i<barcodeStr.length; i++) {
        
        unichar ch = [barcodeStr characterAtIndex:i];
        
        if (ch=='0') {
            narrow+=1;
        }else
        {
            if (i<barcodeStr.length-1) {
                if ([barcodeStr characterAtIndex:i+1]=='1') {
                    wide+=1;
                }else
                {
                    narrow+=1;
                }
            }else
            {
                narrow+=1;
            }
        }
        
    }
    
    CGFloat barWidth=size.width/(narrow+multiplier*wide);
    
    CGFloat x=0.0;
    
    for (uint i=0; i<barcodeStr.length; i++) {
        unichar ch = [barcodeStr characterAtIndex:i];
        if (ch=='0') {
            x+=barWidth;
        }else
        {
            CGFloat customBarWidth = barWidth;
            if (i <barcodeStr.length-1) {
                if ([barcodeStr characterAtIndex:i+1]=='1') {
                    customBarWidth*=multiplier;
                }
            }
            
            CGContextAddRect(context, CGRectMake(x,0, customBarWidth, barHeight));
            x+=customBarWidth;
        }
    }

    
    CGContextSetGrayFillColor(context, 0, 1);
    CGContextSetShouldAntialias(context, NO);
    CGContextFillPath(context);
    
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return image;
}


+ (UIImage *)imageWithBarCode:(BCKCode *)barCode options:(NSDictionary *)options
{
	CGSize neededSize = [barCode sizeWithRenderOptions:options];

	if (!neededSize.width || !neededSize.height)
	{
		return nil;
	}
	
	UIGraphicsBeginImageContextWithOptions(neededSize, NO, 0);
	CGContextRef context = UIGraphicsGetCurrentContext();
	
	[barCode renderInContext:context options:options];
	
	UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
	UIGraphicsEndImageContext();
	
	return image;
}

@end
