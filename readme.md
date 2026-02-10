**Первичная настройка**

Скачайте проект в папку ~/mobile-native

```bash
git clone git@github.com:AwardWallet/mobile-native.git ~/mobile-native
cd ~/mobile-native
```

**Windows юзеры проходят по мануалу https://facebook.github.io/react-native/docs/getting-started (React Native CLI Quickstart - Development OS - Windows, Target OS - Android), выполнить все до шага Creating a new application**

Установите Node

https://github.com/nvm-sh/nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
nvm install --lts
nvm use --lts
nvm alias default node
```
Установите Yarn@1.21.1

https://legacy.yarnpkg.com/lang/en/docs/install

`curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.21.1`

Для сборки ios проекта требуется XCode 14

**Установка Ruby**

Установить RVM (https://rvm.io/)

Установить ruby-2.7.4

`rvm install ruby-2.7.4`

`rvm use ruby-2.7.4`

**Примечания**

Если Docker работает на стандартном порту 8081 то нужно его поменять

в файле frontend/docker-compose-local.yml прописываем

```yaml
services:
    nginx:
        image: nginx
        ports:
            - '8082:80'
```

и перезапускаем Docker

```bash
docker-compose down
docker-compose up -d
```

**Установка проекта**

если нужен только android

`./scripts/setup.sh`

и ios

`./scripts/setup.sh ios`

**Запуск**

Запустить на эмуляторе iPhone SE

`yarn run start:ios`

на эмуляторе iPad Air

`yarn run start:ios:ipad`

на змуляторе Android (нужно чтобы уже был запущен любой андроид эмулятор из AVD Manager), так же перед запуском нужно выполнить `npm start` (выполнить в отдельной вкладке терминала)

`yarn run start:android`

так же можно запустить на любом ios симуляторе

`ENVFILE=.env.development yarn react-native run-ios --simulator "SimulatorName"`

поставив имя симулятора в SimulatorName (список всех доступных симуляторв доступен по команде _xcrun simctl list_)

Если необходимо чтобы приложение обращалось к различным хостам (dev, docker, ip:port, production), правим в файле .env.development строку API_URL

**Обновление проекта**

`./scripts/update.sh`

если проект был настроен и для ios

`./scripts/update.sh ios`
