#!/usr/bin/env php
<?php

class PathUtils
{
    public static function concatPaths(...$paths)
    {
        return implode('/', array_map(function ($path) { return rtrim($path, '/'); }, $paths));
    }
}

interface ConverterInterface
{
    public function __construct($source, $dryRun);

    public function convert();
}

abstract class AbstractConverter implements ConverterInterface
{
    /**
     * @var string
     */
    protected $source;

    /**
     * @var bool
     */
    protected $dryRun;

    public function __construct($source, $dryRun)
    {
        $this->source = $source;
        $this->dryRun = $dryRun;
    }

    /**
     * @return SimpleXMLElement[]
     */
    protected function loadXliff()
    {
        $xmlMap = [];
        /** @var SplFileInfo $xliffFile */
        foreach (new DirectoryIterator($this->source) as $xliffFile) {
            if (!preg_match('/^(.*)\.([^\.]+)\.xliff$/', $xliffFile->getFilename(), $matches)) {
                continue;
            }

            $xml = new \SimpleXMLElement(file_get_contents($xliffFile->getPathname()), LIBXML_NOCDATA);

            foreach($xml->getDocNamespaces() as $strPrefix => $strNamespace) {
                if(strlen($strPrefix)==0) {
                    $strPrefix="tr"; //Assign an arbitrary namespace prefix.
                }
                $xml->registerXPathNamespace($strPrefix,$strNamespace);
            }

            $xmlMap[$matches[1]][$matches[2]] = $xml;
        }



        return $xmlMap;
    }

    abstract public function convert();
}

class IosConverter extends AbstractConverter
{

    public function convert()
    {
        $metadata = json_decode(file_get_contents(__DIR__ . '/translations_ios.json'), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException(json_last_error_msg());
        }

        $keys = $metadata['keys'];
        $localesMap = [];

        foreach ($metadata['locales'] as $localeData) {
            if (is_string($localeData)) {
                $localesMap[$localeData] = $localeData;
            } elseif (is_array($localeData)) {
                $localesMap[key($localeData)] = current($localeData);
            }
        }

        $xmlMap = $this->loadXliff();

        $filesLines = [];

        foreach ($metadata['keys'] as $keyData) {
            if (is_string($keyData)) {
                $sourceKey = $keyData;
                $sourceDomain = 'mobile';
                $target = 'code';
                $isConst = false;
                $targetKey = $sourceKey;
            } else {
                $isConst = isset($keyData['constant']) ? $keyData['constant'] : false;
                $sourceKey = $keyData['source_key'];
                $sourceDomain = isset($keyData['source_domain']) ? $keyData['source_domain'] : 'mobile';
                $target = isset($keyData['target']) ? $keyData['target'] : 'code';
                $targetKey = isset($keyData['target_key']) ? $keyData['target_key'] : $sourceKey;
            }

            foreach ($localesMap as $xliffLocale => $iosLocale) {
                if (!isset($xmlMap[$sourceDomain][$xliffLocale])) {
                    continue;
                }
                /** @var SimpleXMLElement $xmlElement */
                $trans = $xmlMap[$sourceDomain][$xliffLocale]->xpath("//*[(name() = 'trans-unit') and (@resname = '{$sourceKey}')]/*[name()='target']/text()");
                if (!$trans) {
                    $fallbackTrans = $xmlMap[$sourceDomain]['en']->xpath("//*[(name() = 'trans-unit') and (@resname = '{$sourceKey}')]/*[name()='target']/text()");
                    if(!$fallbackTrans)
                        continue;
                    else
                        $trans = addcslashes($fallbackTrans[0], "'\"");
                } else{
                    $trans = addcslashes($trans[0], "'\"");
                }

                $targetFile = ('code' === $target) ? 'Localizable.strings' : 'InfoPlist.strings';

                $filesLines[PathUtils::concatPaths(__DIR__ . '/../ios/AwardWallet/Resources/', $iosLocale . '.lproj')][$targetFile][] = sprintf(
                    ($isConst == false) ? '"%s"="%s";' : '%s="%s";',
                    $targetKey,
                    $trans
                );
            }
        }

        foreach ($filesLines as $path => $files) {
            if (!file_exists($path)) {
                echo "Creating dir $path\n";
                if (!$this->dryRun) {
                    mkdir($path);
                }
            }

            foreach ($files as $fileName => $fileLines) {
                $fullname = PathUtils::concatPaths($path, $fileName);
                echo "Writing {$fullname}\n";
                if (!$this->dryRun) {
                    file_put_contents($fullname, implode("\n", $fileLines));
                }
            }
        }
    }
}

class AndroidConverter extends AbstractConverter
{

    public function convert()
    {
        $metadata = json_decode(file_get_contents(__DIR__ . '/translations_android.json'), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException(json_last_error_msg());
        }

        $localesMap = [];
        foreach ($metadata['locales'] as $localeData) {
            if (is_string($localeData)) {
                $localesMap[$localeData] = $localeData;
            } elseif (is_array($localeData)) {
                $localesMap[key($localeData)] = current($localeData);
            }
        }

        $xmlMap = $this->loadXliff();
        $translations = [];
        foreach ($metadata['keys'] as $keyData) {
            if (is_array($keyData) && isset($keyData['modules']) && is_array($keyData['modules'])) {
                $paths = [];
                foreach($keyData['modules'] as $moduleName) {
                    if ($moduleName == 'main') {
                        $paths[] = __DIR__ . '/../android/app/src/main/res';
                    } else {
                        $path = __DIR__ . "/../node_modules/$moduleName/res";
                        if (file_exists($path)) {
                            $paths[] = $path;
                        } else {
                            echo "Dir \"$path\" does not exists\n";
                        }
                    }
                }
            } else {
                $paths = [
                    __DIR__ . '/../android/app/src/main/res'
                ];
            }

            if (is_string($keyData)) {
                $sourceKey = $keyData;
                $sourceDomain = 'mobile';
            } else {
                $sourceKey = $keyData['source_key'];
                $sourceDomain = isset($keyData['source_domain']) ? $keyData['source_domain'] : 'mobile';
            }

            foreach ($localesMap as $xliffLocale => $locale) {
                if (!isset($xmlMap[$sourceDomain][$xliffLocale])) {
                    continue;
                }
                /** @var SimpleXMLElement $xmlElement */
                $trans = $xmlMap[$sourceDomain][$xliffLocale]->xpath("//*[(name() = 'trans-unit') and (@resname = '{$sourceKey}')]/*[name()='target']/text()");

                if (!$trans) {
                    $fallbackTrans = $xmlMap[$sourceDomain]['en']->xpath("//*[(name() = 'trans-unit') and (@resname = '{$sourceKey}')]/*[name()='target']/text()");
                    if (!$fallbackTrans) {
                        if (is_array($keyData) && isset($keyData['desc'])) {
                            $trans = $keyData['desc'];
                        } else {
                            continue;
                        }
                    }
                    else
                        $trans = addcslashes($fallbackTrans[0], "'\"");
                } else {
                    $trans = addcslashes($trans[0], "'\"");
                }

                foreach ($paths as $path) {
                    $translations[$path][$locale][$sourceDomain . "." . $sourceKey] =
                        sprintf('    <string name="%s">%s</string>',
                            str_replace("-", "_", $sourceDomain . "." . $sourceKey),
                            preg_replace('/\\%([^\\%]+)\\%/ims', '<xliff:g id="$1">\\$s</xliff:g>',
                                htmlspecialchars($trans))
                        );
                }
            }
        }

        foreach ($translations as $path => $array) {
            foreach ($array as $locale => $trans) {
                if (strtolower($locale) != 'en') {
                    $localePath = PathUtils::concatPaths($path, 'values-' . $locale);
                } else {
                    $localePath = PathUtils::concatPaths($path, 'values');
                }
                if (!file_exists($localePath)) {
                    echo "Creating dir $localePath\n";
                    if (!$this->dryRun) {
                        mkdir($localePath);
                    }
                }

                $localePath = PathUtils::concatPaths($localePath, 'translations.xml');
                echo "Writing {$localePath}\n";

                if (!$this->dryRun) {
                    file_put_contents($localePath,
                        "<?xml version='1.0' encoding='utf-8'?>\n<resources tools:ignore=\"ExtraTranslation\" xmlns:tools=\"http://schemas.android.com/tools\">\n" .
                        implode("\n", $trans)
                        . "\n</resources>"
                    );
                }

            }
        }
    }
}

$options = getopt('h::', ['source:', 'dry-run::', 'help::']);

if (
        isset($options['help']) ||
        isset($options['h']) ||
        !isset($options['source'])
) {
    echo "usage: import_translations.php --source <source_dir> [--dry-run] [-h | --help]
ex.: import_translations.php --source /www/awardwallet/bundles/AwardWallet/MainBundle/Resources/translations
    --source: dir with *.xliff files
    --dry-run: do not modify\\overwrite anything
    --help, -h: print this help
";
    die();
}

$sourcePath = $options['source'];
if (!glob(PathUtils::concatPaths($sourcePath, '*.xliff'))) {
    throw new \RuntimeException('No *.xliff files in source path');
}

$dryRun = isset($options['dry-run']);

/** @var ConverterInterface[] $converters */
$converters = [
    new IosConverter($sourcePath, $dryRun),
    new AndroidConverter($sourcePath, $dryRun),
];

foreach ($converters as $converter)
{
    $converter->convert();
}
