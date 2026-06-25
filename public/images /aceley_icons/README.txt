ACELEY — APP ICON PACKAGE
Background: Dark Indigo gradient  #3B3399 -> #1E1B4B
Mascot: gold character (raster). Favicons use the geometric A+ monogram
(white mark + gold #FACC15 accent) because the mascot is illegible below ~48px.

aceley_icon_master_1024.png   Master art, square, full-bleed (no alpha).
aceley_icon.svg               Scalable tile + embedded mascot.

ios/                          AppIcon-*.png  (square, no transparency, no
                              rounded corners — iOS rounds automatically).
                              Drop into Assets.xcassets / AppIcon set.

android/mipmap-*/ic_launcher.png   Legacy launcher icons per density.
android/adaptive/                  Adaptive icon (Android 8+):
   ic_launcher_foreground.png      mascot, transparent, sits in 66dp safe zone
   ic_launcher_background.png      indigo gradient
android/ic_launcher_playstore_512.png   Play Store listing.

web/    icon-192 / icon-512        PWA "any" icons
        maskable-192 / -512        PWA "maskable" (extra safe-zone padding)
        apple-touch-icon.png       180px, iOS home screen
        favicon.ico / .svg / -16 / -32 / -48   browser tab (monogram)
        site.webmanifest           ready manifest
        head-snippet.html          paste into your <head>

NOTE: lockups (wordmark + mascot) and the monogram wordmark set are separate
files outside this package.
