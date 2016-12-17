# install nodejs and npm
brew install nodejs
install nodejs



npm install -g yo
npm install -g bower
npm install -g gulp


# install and update ruby
brew install ruby-install
ruby-install -i /usr/local/bin ruby 2.1.0

# install compass
sudo gem install compass
# install bundler
sudo gem install bundler

# PC app
# goto application directory and install required packages
npm install gulp-nw-builder --save
bower install
npm install
# build moi truong web, chay tren Chrome
gulp serve
# build de chay tren PC (exe)
gulp buildnw



# mobile app ios
npm install node-sass --save
npm install -g ios-sim
npm install -g ios-deploy

# fix error install node-sass
npm uninstall --save-dev gulp-sass
npm install --save-dev gulp-sass@2


#setup moi truong mobile
npm install -g ionic
npm install -g cordova


# chay debug
ionic serve (chay tren Chrome)

# add platform android before build

cordova platform add android
cordova plugin add cordova-plugin-whitelist
cordova plugin add ionic-plugin-keyboard
cordova plugin add onesignal-cordova-plugin
cordova plugin add cordova-plugin-app-event
cordova plugin add cordova-plugin-globalization
cordova plugin add cordova-plugin-badge
cordova build

# add platform ios before build
cordova platform add ios
cordova plugin add cordova-plugin-whitelist
cordova plugin add ionic-plugin-keyboard
cordova plugin add onesignal-cordova-plugin
cordova build