# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# React Navigation
-keep class com.reactnavigation.** { *; }

# Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# Image Picker
-keep class com.imagepicker.** { *; }

# Date Time Picker
-keep class com.reactcommunity.rndatetimepicker.** { *; }

# Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# Screens
-keep class com.swmansion.rnscreens.** { *; }

# Expo modules
-keep class expo.modules.** { *; }

# Security - Keep encryption classes
-keep class javax.crypto.** { *; }
-keep class java.security.** { *; }

# HIPAA Compliance - Keep audit logging classes
-keep class android.util.Log { *; }

# Performance optimization
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify

# Remove logging in release builds (except security logs)
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
}

# Keep security and audit logs
-keep class * {
    public static *** logSecurityEvent(...);
    public static *** logAuditEvent(...);
}