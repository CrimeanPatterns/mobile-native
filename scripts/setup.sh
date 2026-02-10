#!/usr/bin/env bash

# Check for yarn
if ! which yarn &> /dev/null; then
  printf "\t\033[41mPlease install Yarn (https://legacy.yarnpkg.com/lang/en/docs/install)\033[0m"
  exit 1
fi

if [ ! -f "./android/gradle.properties" ]; then
    cp ./android/gradle.properties.dist ./android/gradle.properties
fi

read -p "Enter destination for www folder (default: /Users/$(id -u -n)/docker/frontend/): " dest_folder
cp translations.json.dist translations.json

dest_folder=${dest_folder:-"/Users/$(id -u -n)/docker/frontend/"}
translationFile=`sed "s|%PATH_TO_FRONTEND%|"${dest_folder}"|g" translations.json`
echo "$translationFile" > translations.json

read -p "Enter url for docker (default: http://awardwallet.docker) or you IP:PORT: " api_url
cp .env.dist .env.development

api_url=${api_url:-"http://awardwallet.docker"}
envDev=`sed "s|%API_URL%|"${api_url}"|g" .env.development`
echo "$envDev" > .env.development

echo "Install modules"
ssh-add
yarn

if [ $1 = "ios" ]; then
    # Check for CocoaPods
    if ! which pod &> /dev/null; then
      printf "\t\033[41mPlease install CocoaPods\033[0m"
      exit 1
    fi

    bundle install
    bundle exec pod install --project-directory=ios
fi

echo "Complete."
