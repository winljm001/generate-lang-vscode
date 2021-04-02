import { OutputChannel, window } from 'vscode';
const EXT_NAME="lalala-i18N";

export class Log {
  private static _channel: OutputChannel;

  static get outputChannel(): OutputChannel {
    if (!this._channel) {this._channel = window.createOutputChannel(EXT_NAME);}
    return this._channel;
  }

  static raw(...values: any[]) {
    this.outputChannel.appendLine(values.map((i) => i.toString()).join(' '));
  }

  static info(message: string, intend = 0) {
    this.outputChannel.appendLine(`${'\t'.repeat(intend)}${message}`);
    this._channel.show();
  }

  static warn(message: string, prompt = false, intend = 0) {
    if (prompt) {window.showWarningMessage(message);}
    Log.info(`⚠ WARN: ${message}`, intend);
  }

  static show() {
    this._channel.show();
  }

  static divider() {
    this.outputChannel.appendLine('\n――――――\n');
  }
}
