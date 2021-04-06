import * as vscode from 'vscode';
import { generate } from './generate';
import { extract } from './extract';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let generateLang = vscode.commands.registerCommand('lalala-generate-lang.generateLang', (uri) => {
		// 生成多语言文件及excel
		generate(uri,context);
	});
	// 提取多语言
	let extractLang = vscode.commands.registerCommand('lalala-generate-lang.extractLang', (uri) => {
		extract();
	});
	
	context.subscriptions.push(extractLang);
	context.subscriptions.push(generateLang);
}

export function deactivate() {}
