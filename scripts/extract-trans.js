#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const jsToXliff12 = require('xliff/jsToXliff12');
const xliff12ToJs = require('xliff/xliff12ToJs');

const config = JSON.parse(fs.readFileSync('./translations.json'));

function* filterTree(jsonObj, filter) {
    if (Array.isArray(jsonObj)) {
        for (const value of jsonObj) {
            if (filter(value) === true) {
                yield value;
            }

            yield* filterTree(value, filter);
        }
    } else if (typeof jsonObj === 'object' && jsonObj !== null) {
        for (const [key, value] of Object.entries(jsonObj)) {
            if (filter(value) === true) {
                yield value;
            }

            yield* filterTree(value, filter);
        }
    }
}

function extractTranslations(ast, src) {
    return Array.from(
        filterTree(ast, (expression) => {
            if (!expression || !expression.type || expression.type !== 'CallExpression') {
                return false;
            }

            const {callee} = expression;
            const isTransCall =
                callee && callee.object && callee.property && (callee.property.name === 'trans' || callee.property.name === 'transChoice');

            if (!isTransCall) {
                return false;
            }

            const args = expression.arguments;

            if (!args || args.length < 1) {
                return false;
            }

            const key = args[0];

            if (!key || key.type !== 'StringLiteral') {
                return false;
            }

            const domainArgPosition = callee.property.name === 'trans' ? 2 : 3;
            const domain = args[domainArgPosition];

            if (!domain) {
                return true;
            }

            return domain.type === 'StringLiteral';
        }),
    ).map((expression) => {
        const args = expression.arguments;
        const domainArgPosition = expression.callee.property.name === 'trans' ? 2 : 3;

        const commentStart = expression.callee.property.end + 1;
        const commentEnd = args[0].start - 1;
        const comment = src.substr(commentStart, commentEnd - commentStart).trim();

        const trans = {
            key: args[0].value,
            domain: args[domainArgPosition] ? args[domainArgPosition].value : 'messages',
            desc: null,
        };

        const descMatches = /@Desc\(("([^"\\]|\\.)*"|'([^'\\]|\\.)*')\)/g.exec(comment);

        if (descMatches && descMatches.length > 0) {
            trans.desc = descMatches[1].substr(1, descMatches[1].length - 2).replace(/\\(.)/gm, '$1');
        }

        return trans;
    });
}

function* getJsFiles(src) {
    const isDir = fs.lstatSync(src).isDirectory();
    const entries = isDir ? fs.readdirSync(src) : [src];

    for (let entry of entries) {
        entry = isDir ? path.join(src, entry) : entry;

        if (config.exclude.indexOf(entry) !== -1) {
            continue;
        }

        if (fs.lstatSync(entry).isDirectory()) {
            yield* getJsFiles(entry);
        } else if (['js', 'ts', 'tsx'].includes(entry.split('.').pop())) {
            yield entry;
        }
    }
}

const DOMAIN_TEMPLATE = {
    resources: {
        'not.available': {},
    },
    sourceLanguage: 'en',
    targetLanguage: 'en',
};

function updateTrans(domain, trans) {
    domain = domain || DOMAIN_TEMPLATE;

    trans.files = [...new Set(trans.files)];

    if (trans.key in domain.resources['not.available']) {
        if (!domain.resources['not.available'][trans.key].alive) {
            domain.resources['not.available'][trans.key].files = trans.files;
        }

        domain.resources['not.available'][trans.key].alive = true;
    } else {
        if (trans.desc === null) {
            throw `Key "${trans.key}" has no @Desc.`;
        }

        domain.resources['not.available'][trans.key] = {
            source: trans.desc,
            target: trans.desc,
            files: trans.files,
            alive: true,
        };
    }

    return domain;
}

function clearUnused(domain) {
    for (const [transKey, trans] of Object.entries(domain.resources['not.available'])) {
        if (!trans.alive) {
            delete domain.resources['not.available'][transKey];
        }
    }

    return domain;
}

console.log('Parsing js-sources...');

const jsCatalogue = config.include
    .map((el) => Array.from(getJsFiles(el)))
    .reduce((acc, list) => acc.concat(list), [])
    .reduce((jsCatalogue, jsFile) => {
        const jsSource = fs.readFileSync(jsFile).toString();

        extractTranslations(babel.parse(jsSource, {filename: jsFile, presets: ['module:metro-react-native-babel-preset']}), jsSource).forEach(
            (trans) => {
                if (!(trans.domain in jsCatalogue)) {
                    jsCatalogue[trans.domain] = {};
                }

                if (!(trans.key in jsCatalogue[trans.domain])) {
                    jsCatalogue[trans.domain][trans.key] = {
                        ...trans,
                        files: [jsFile],
                    };
                } else {
                    jsCatalogue[trans.domain][trans.key].files.push(jsFile);
                    if (trans.desc != null && jsCatalogue[trans.domain][trans.key].desc == null) {
                        jsCatalogue[trans.domain][trans.key].desc = trans.desc;
                    }
                }
            },
        );

        return jsCatalogue;
    }, {});

console.log('Keys usage:');
console.table(
    Object.entries(jsCatalogue)
        .map(([domain, keys]) => ({domain, keys_count: Object.entries(keys).length}))
        .sort((a, b) => b.keys_count - a.keys_count),
);

console.log('Loading existing mobile translations...');

const existingMobileCatalogue = fs
    .readdirSync(config.transDir)
    .filter((xliff) => /.xliff$/.exec(xliff))
    .reduce((existingCatalogue, xliff) => {
        const [, domain, lang] = /^([^\.]+)\.([^\.]+)\.xliff$/.exec(xliff);
        const xliffFile = path.join(config.transDir, xliff);
        // console.log(`Loading "${xliffFile}"...`);
        const xliffContent = fs.readFileSync(xliffFile).toString();
        existingCatalogue[lang] = existingCatalogue[lang] || {};
        existingCatalogue[lang][domain] = xliff12ToJs(xliffContent, (_) => {});

        return existingCatalogue;
    }, {});

console.log('Dumping xliff files:');

for (const dumpDomainName of config.dumpDomains) {
    if (!(dumpDomainName in jsCatalogue)) {
        continue;
    }

    existingMobileCatalogue.en = existingMobileCatalogue.en || {};

    let domainData = existingMobileCatalogue.en && existingMobileCatalogue.en[dumpDomainName] ? existingMobileCatalogue.en[dumpDomainName] : null;

    for (const [, trans] of Object.entries(jsCatalogue[dumpDomainName])) {
        domainData = updateTrans(domainData, trans);
    }

    domainData = clearUnused(domainData);
    existingMobileCatalogue.en[dumpDomainName] = domainData;
    const xliffName = `${dumpDomainName}.en.xliff`;

    if (Object.entries(domainData.resources['not.available']).length > 0) {
        console.log(`Writing to "${xliffName}".`);
        fs.writeFileSync(path.join(config.transDir, xliffName), `${'<?xml version="1.0" encoding="utf-8"?>' + '\n'}${jsToXliff12(domainData, {})}`);
    }
}

console.log('Dumping js files to frontend:');

let jsString =
    '// This file was auto-generated by script/extract-trans.js from mobile-native project\n//\n//\n//PLEASE DO NOT CHANGE IT MANUALLY!\n\n\n';

for (const [domain, keys] of Object.entries(jsCatalogue)) {
    for (const key of Object.keys(keys)) {
        jsString += `Translator.trans(${JSON.stringify(key)}, {}, ${JSON.stringify(domain)});\n`;
    }
}

const jsPath = path.join(config.frontendDir, 'web', 'assets', 'common', 'js', 'mobile_translations.js');
console.log(`Writing to "${jsPath}"`);
fs.writeFileSync(jsPath, jsString);

console.log('Dumping js files to mobile:');

const frontendTransDir = path.join(config.frontendDir, 'translations');
const existingFrontendCatalogue = fs
    .readdirSync(frontendTransDir)
    .filter((xliff) => /\.[^\.]+\.xliff$/.exec(xliff))
    .reduce((existingCatalogue, xliff) => {
        const [, domain, lang] = /^([^\.]+)\.([^\.]+)\.xliff$/.exec(xliff);
        const xliffFile = path.join(frontendTransDir, xliff);
        // console.log(`Loading "${xliffFile}"...`);
        const xliffContent = fs.readFileSync(xliffFile).toString();
        existingCatalogue[lang] = existingCatalogue[lang] || {};
        existingCatalogue[lang][domain] = xliff12ToJs(xliffContent, (_) => {});

        return existingCatalogue;
    }, {});

const langs = [...new Set([...Object.keys(existingFrontendCatalogue), ...Object.keys(existingMobileCatalogue)])];

const existingDomains = new Map(
    Object.keys(jsCatalogue).map((domain) => [domain, new Set(Object.entries(jsCatalogue[domain] || {}).map(([key]) => key))]),
);

function trim(value) {
    var temp = value;
    var obj = /^(\s*)([\W\w]*)(\b\s*$)/;
    if (obj.test(temp)) { temp = temp.replace(obj, '$2'); }
    var obj = / +/g;
    temp = temp.replace(obj, " ");
    if (temp == " ") { temp = ""; }
    return temp;
}

for (const lang of langs) {
    for (const catalogue of [existingMobileCatalogue, existingFrontendCatalogue]) {
        if (!catalogue[lang]) {
            continue;
        }

        let jsFileContent = `import Translator from 'bazinga-translator';

(function (t) {\n// ${lang}\n`;

        let writeTrigger = false;

        for (const [domain, domainData] of Object.entries(catalogue[lang])) {
            for (const [key, trans] of Object.entries(domainData.resources['not.available'])) {
                const existingDomain = existingDomains.get(domain);

                if (existingDomain) {
                    if (existingDomain.has(key)) {
                        writeTrigger = true;
                        jsFileContent += `t.add(${JSON.stringify(key)}, ${JSON.stringify(trim(trans.target))}, ${JSON.stringify(domain)}, ${JSON.stringify(
                            lang,
                        )});\n`;
                    }
                }
            }
        }

        if (writeTrigger) {
            jsFileContent += '})(Translator);';
            const jsFile = path.join('app', 'assets', 'languages', `${lang}.js`);
            console.log(`Writing to "${jsFile}"...`);
            fs.writeFileSync(jsFile, jsFileContent);
        }
    }
}

console.log('Done!');
