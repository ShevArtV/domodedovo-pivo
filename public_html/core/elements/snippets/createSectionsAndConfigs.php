<?php
// подключаем модель объекта MIGX
$modx->addPackage('migx', $modx->getOption('core_path') . 'components/migx/model/');
// путь к файлу с вёрсткой
$pathToHtml = MODX_CORE_PATH . 'elements/layout/index.html';
// путь к папке в которую будем складывать секции
$pathToSections = MODX_CORE_PATH . 'elements/sections/';
// указываем имя созданной вручную или импортированной из файла конфигурации, из которой будет брать настройки
$defaultSectionName = 'base';

// получаем базовые настройки секции
$defaultConfig = $modx->getObject('migxConfig', array('name' => $defaultSectionName));
$defaultConfig = $defaultConfig->toArray();
unset($defaultConfig['id']); // удаляем id, т.к. он задается автоматически при создании объекта

// подготавливаем и выполняем запрос в БД, чтобы получить имена уже созданных конфигураций.
$sql = "SELECT name FROM " . $modx->getOption('table_prefix') . "migx_configs WHERE name != 'base'";
$statement = $modx->query($sql);
$configNames = $statement->fetchAll(PDO::FETCH_COLUMN);

// получаем вёрстку
$html = file_get_contents($pathToHtml);

// получаем названия секций
preg_match_all('/<!-- #(.*?) -->/', $html, $names);
// получаем описание секции
preg_match_all('/<!-- \*(.*?) -->/', $html, $desc);
// удаляем пробельные символы
$html = str_replace(["\r", "\n"], "", $html);
// получаем содержимое секций
preg_match_all('/<!-- #.*? -->(.*?)<!-- \/.*? -->/', $html, $sections);

if (count($names[1]) === count($sections[1]) && count($names[1]) > 0) {
    foreach ($names[1] as $k => $name) {
        $preparedName = str_replace(' ', '_', strtolower(trim($name))); // заменяем пробелы на _ и переводим в нижний регистр
        $fullFileName = $pathToSections . $preparedName . '.html'; // формируем полный путь к файлу секции
        if (!file_exists($fullFileName)) { // если такого файла нет
            file_put_contents($fullFileName, $sections[1][$k]); // создаем
        }
        $defaultConfig['name'] = $preparedName;
        $defaultConfig['extended']['multiple_formtabs_optionstext'] = str_replace('section', '', $desc[1][$k]); // формируем подпись для списка конфигураций
        if (!in_array($preparedName, $configNames)) { // если такой конфигурации нет, то создаем новый объект
            $defaultConfig['createdon'] = date('Y-m-d H:i:s');
            $newConfig = $modx->newObject('migxConfig');
        } else {// или получаем конфигурацию из БД для обновления
            $newConfig = $modx->getObject('migxConfig', array('name' => $preparedName));
            $defaultConfig['editedon'] = date('Y-m-d H:i:s');
        }

        $newConfig->fromArray($defaultConfig);
        $newConfig->save();
    }
    return 'SUCCESS';
}
return 'FAILED';

/*
// запустить в консоли
$pdoTools = $modx->getService('pdoTools');
echo $pdoTools->runSnippet('@FILE snippets/createSectionsAndConfigs.php');
*/