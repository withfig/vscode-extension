const vscode = require('vscode');
const cp = require('child_process')

let runCommand = function (command) {
	cp.exec(command, (err, stdout, stderr) => {
		if (err) {
			logError(err);
		}
	});
}

// fig.log is an internal setting as it's intended for developers only, this means it won't show up
// in the settings UI/editor. Add `"fig.log": true` to your settings.json and reload the window to
// enable logging.
let shouldLog = vscode.workspace.getConfiguration().get('fig.log') === true;

function log(...args) {
	if (shouldLog) {
		console.log(`fig: ${args[0]}`, args.slice(1));
	}
}

function logError(message) {
	console.error(`fig: ${message}`);
}

function activate(context) {
	try {
		log("Terminals: " + vscode.window.terminals.length);

		try {
			log(vscode.window.activeTerminal.name)
			vscode.window.activeTerminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})
		} catch (e) {
			log("Fig integration: " + e)
		}

		vscode.window.onDidChangeWindowState(event => {
			log("onDidChangeWindowState", event)
			log(vscode.window.activeTerminal, vscode.window.activeTextEditor, vscode.context)

			vscode.window.activeTerminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})

		})
		vscode.window.onDidOpenTerminal(terminal => {
			log("Terminal opened. Total count: " + vscode.window.terminals.length);
			log("terminal", terminal)
			terminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})
		});

		vscode.window.onDidCloseTerminal(terminal => {
			log("Terminal closed. Total count: " + vscode.window.terminals.length);
			log("terminal", terminal)

			vscode.window.activeTerminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})
		});

		vscode.window.onDidChangeActiveTerminal(terminal => {
			log(`Active terminal changed, name=${terminal ? terminal.name : 'undefined'}`);
			terminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})
			log(vscode.window.activeTerminal, vscode.window.terminals, vscode.window.terminals.indexOf(vscode.window.activeTerminal))
		});

		vscode.window.onDidChangeActiveTextEditor(editor => {
			log(`Active texteditor changed`);
			vscode.window.activeTerminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})
			log(vscode.window.activeTerminal.name)
		})
	} catch (e) {
		logError(e)
	}
}
exports.activate = activate;

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
