echo "Rename project ..."

# Rename project
react-native-rename $1 -b $2

# Rename in package json
sed -i "" "s/IcodeRNTemplate/$1/g" package.json

# Rename for iOS
mv ios/$1.xcodeproj/xcshareddata/xcschemes/IcodeRNTemplate-Staging.xcscheme ios/$1.xcodeproj/xcshareddata/xcschemes/$1-Staging.xcscheme
sed -i "" "s/IcodeRNTemplate/$1/g" ios/$1.xcodeproj/xcshareddata/xcschemes/$1-Staging.xcscheme
sed -i "" "s/IcodeRNTemplate/$1/g" ios/$1/LaunchScreen.storyboard
sed -i "" "s/IcodeRNTemplate/$1/g" ios/Config.xcconfig

# Rename for Android
sed -i "" "s/IcodeRNTemplate/$1/g" android/app/src/staging/res/values/strings.xml
sed -i "" "s/com.icoderntemplate/$2/g" android/app/_BUCK

