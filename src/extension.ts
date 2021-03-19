const path = require('path');
const fs = require('fs');
const defaultConfig = require('./config.json');
import * as vscode from 'vscode';
import { main } from './main';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "generate-lang-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('generate-lang-vscode.generateLang', (uri) => {
		// The code you place here will be executed every time your command is executed
		// 读取ts文件
		const langPath=uri?.fsPath;
		const workspaceFolders=vscode.workspace?.workspaceFolders;
		let workspacePath='./';
		if(workspaceFolders&&workspaceFolders?.length>0){
			const {uri}= workspaceFolders[0];
			workspacePath=uri?.fsPath;
		}
		const CONFIG_PATH = path.normalize(path.join(workspacePath,'./generate-lang-config.json'));
		
		let config={...defaultConfig,mainLangPath:path.normalize(langPath)};
		try {
			 config = JSON.parse(fs.readFileSync(CONFIG_PATH,'utf-8'));
		} catch (error) {
			try {
				const workspaceFolders=vscode.workspace?.workspaceFolders;
				if(workspaceFolders&&workspaceFolders?.length>0){
					const {uri}= workspaceFolders[0];
					// 没有配置文件生成配置文件
					fs.writeFileSync(`${uri?.fsPath}/generate-lang-config.json`,JSON.stringify(config));
				}
			} catch (error) {
				console.log(error);	
			}
		}
		main(config);
		// // Display a message box to the user
		// vscode.window.showInformationMessage(langPath);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
