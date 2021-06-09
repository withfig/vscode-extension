const vscode = require('vscode');
const cp = require('child_process')

let runCommand = function (command) {
	cp.exec(command, (err, stdout, stderr) => {
		if (err) {
			console.log('error: ' + err);
		}
	});
}

function activate(context) {
	try {
		console.log("Terminals: " + vscode.window.terminals.length);

		try {
			console.log(vscode.window.activeTerminal.name)
			vscode.window.activeTerminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})
		} catch (e) {
			console.log("Fig integration: " + e)
		}

		vscode.window.onDidChangeWindowState(event => {
			console.log("onDidChangeWindowState", event)
			console.log(vscode.window.activeTerminal, vscode.window.activeTextEditor, vscode.context)
			if (!state.focused) {
				return
			}

			vscode.window.activeTerminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})

		})
		vscode.window.onDidOpenTerminal(terminal => {
			console.log("Terminal opened. Total count: " + vscode.window.terminals.length);
			console.log("terminal", terminal)
			terminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})
		});

		vscode.window.onDidCloseTerminal(terminal => {
			console.log("Terminal closed. Total count: " + vscode.window.terminals.length);
			console.log("terminal", terminal)

			vscode.window.activeTerminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})
		});

		vscode.window.onDidChangeActiveTerminal(terminal => {
			console.log(`Active terminal changed, name=${terminal ? terminal.name : 'undefined'}`);
			terminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})
			console.log(vscode.window.activeTerminal, vscode.window.terminals, vscode.window.terminals.indexOf(vscode.window.activeTerminal))
		});

		vscode.window.onDidChangeActiveTextEditor(editor => {
			console.log(`Active texteditor changed`);
			vscode.window.activeTerminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})
			console.log(vscode.window.activeTerminal.name)
		})
	} catch (e) {
		console.log("Fig integration: " + e)
	}
}
exports.activate = activate;

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
