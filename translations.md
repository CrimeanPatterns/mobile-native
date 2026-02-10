**Настройка**

**Обновить проект**:

```bash
$ ./scripts/update.sh
```
Перед запуском нужно скопировать шаблон настроек (если первоначальная настройка была сделана не через ./scripts/setup.sh):

`cp translations.json.dist translations.json`

указать в нем путь(лучше абсолютный) до frontend папки(нужен полный checkout):
`"frontendDir": "/mnt/www/frontend"
`

translations.json:

```json
{
    "transDir": "translations", // куда дампить xliff-файлы доменов из dumpDomains
    "include": [ // где искать js-файлы
        "app" 
    ],
    "exclude": [ // папки\файлы для исключения из сканирования
        "app/assets/languages",
        "app/vendor/crashlytics",
        "app/vendor/intl" 
    ],
    "dumpDomains": [ // список доменов которые будет дампиться в xliff файлы в mobile-native проекте 
        "mobile-native" 
    ],
    "frontendDir": "/mnt/www/frontend" // путь до корня frontend-проекта
}
```

**Схема работы скрипта:**

Скрипт преобразует(с помощью babel) js\jsx код в AST-дерево, из него извлекаются вызовы вида:

```javascript
Translator.trans('some.key', params, 'domain')
Translator.transChoice('some.choice.key', number, params, 'domain')
```

Отсутствующий domain будет считаться за messages.

Изпользуемые в мобильном ключи дампятся в файл frontend-проекта %frontend_dir%/src/assets/common/js/mobile_translations.js для того, чтобы экстрактор не удалил ключи, которые использует мобильное. Поддерживайте актуальность этого файла во frontend-проекте.

Ключи с @Desc аннотациями из доменов config.dumpDomains[] дампятся в xliff-файлы в config.transDir. Их по-необходимости нужно копировать к переводам frontend-проекта, заливать на перевод в xtm, после перевода копировать файлы с переводами обратно.

`Translator.trans(/** @Desc("Some key desc") 'some.key', params, 'mobile-native')`

Загружаются xliff файлы из frontend-проекта для последующего дампа в js ключей, используемых в мобильном. 
Иппользуемые в мобильном ключи дампятся в js-файлы в app/assets/languages.

**Запуск**

Скрипт запускается из корня mobile-native проекта:
```
user@host:/mnt/www/mobile-native$ ./scripts/extract-trans.js

Parsing js-sources...
Keys usage:
┌─────────┬──────────────┬────────────┐
│ (index) │    domain    │ keys_count │
├─────────┼──────────────┼────────────┤
│    0    │   'mobile'   │    111     │
│    1    │  'messages'  │     73     │
│    2    │    'menu'    │     12     │
│    3    │  'booking'   │     3      │
│    4    │ 'validators' │     2      │
└─────────┴──────────────┴────────────┘
Loading existing mobile translations...
Dumping xliff files:
Dumping js files to frontend:
Writing to "/mnt/www/frontend/src/assets/common/js/mobile_translations.js" 
Dumping js files to mobile:
Writing to "app/assets/languages/de.js"...
Writing to "app/assets/languages/en.js"...
Writing to "app/assets/languages/es.js"...
Writing to "app/assets/languages/fr.js"...
Writing to "app/assets/languages/pt.js"...
Writing to "app/assets/languages/ru.js"...
Writing to "app/assets/languages/zh_CN.js"...
Writing to "app/assets/languages/zh_TW.js"...
Done!
```