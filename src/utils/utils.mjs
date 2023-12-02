import * as fs from 'fs';
import * as path from "node:path";
import { configs } from './configs.cjs';
import { makeAngularComponent } from '../stubs/angular/make-angular-component.mjs';
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
const createComponent = (componentName, framework, template, customFolder = '') => {
    const destinationFolder = `${configs.BASE_DIR}${configs.COMPONENT_FOLDER}`;
    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder);
    }
    const templateFilePath = path.join(configs.INIT_PATH, 'src', configs.STUBS_DIR, framework, template);
    fs.readFile(templateFilePath, 'utf8', (err, data) => {
        const customDestinationFolder = path.join(configs.BASE_DIR, configs.COMPONENT_FOLDER, customFolder);
        const extension = template.substring(template.indexOf('.'));
        const compFileName = `${componentName}${extension}`;
        if (!fs.existsSync(customDestinationFolder)) {
            fs.mkdirSync(customDestinationFolder);
        }
        const filePathDestination = path.join(configs.BASE_DIR, configs.COMPONENT_FOLDER, customFolder, compFileName);
        if (framework === 'angular') {
            makeAngularComponent(filePathDestination, data, componentName);
        }
        else {
            data = data.replaceAll("ComponentName", capitalizeFirstLetter(componentName));
            writeFile(filePathDestination, data);
        }
        if (template == 'function-component-css-module.jsx'
            || template == 'function-component-css-module.tsx') {
            const styleFileName = `${componentName}.module.css`;
            const styleFilePathDestination = path.join(configs.BASE_DIR, configs.COMPONENT_FOLDER, customFolder, styleFileName);
            writeFile(styleFilePathDestination, `.${componentName} {\n\tfont-size: 1.125rem; /* 18px */\n\tline-height: 1.75rem; /* 28px */\n\tfont-weight: bold;\n}\n`);
        }
    });
};
export default createComponent;
export function writeFile(filePathDestination, data) {
    fs.writeFile(filePathDestination, data, (err) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log('✅ CREATE Component: ' + filePathDestination);
        }
    });
}
