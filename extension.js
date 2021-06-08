// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cp = require('child_process')

let runCommand = function (command) {
	cp.exec(command, (err, stdout, stderr) => {
		if (err) {
			console.log('error: ' + err);
		}
	});
}

// let figlog = function (vscode, console) {
// 	console.log(vscode.window.activeTerminal, vscode.window.activeTextEditor, vscode.context)
// 	console.log(vscode.window.activeTerminal.name)
// 		(async () => {
// 			let pid = await vscode.window.activeTerminal.processId
// 			console.log(pid)
// 		})()
// }

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	// var next = vscode.window.terminals.length
	// var uniqueTerminalIDs = vscode.window.terminals.reduce((elm, acc, idx) => {
	// 	acc[elm] = idx
	// 	return acc
	// })
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

		// vscode.window.onDidOpenTerminal
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

			// var uid = uniqueTerminalIDs[terminal]
			// console.log("uid:", uid)
			// if (!uid) {
			// 	uid = next++
			// 	console.log(`Creating new UID (${uid}) for terminal ${terminal.name}`)
			// 	uniqueTerminalIDs[terminal] = uid
			// }

			// console.log(uniqueTerminalIDs)


		});

		vscode.window.onDidCloseTerminal(terminal => {
			console.log("Terminal closed. Total count: " + vscode.window.terminals.length);
			console.log("terminal", terminal)

			vscode.window.activeTerminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})
			// let uid = uniqueTerminalIDs[terminal]
			// console.log(`Removing UID (${uid}) for terminal ${terminal.name}`)

			// delete uniqueTerminalIDs[terminal]
			// console.log(uniqueTerminalIDs)
		});



		// vscode.window.onDidChangeActiveTerminal
		vscode.window.onDidChangeActiveTerminal(terminal => {
			console.log(`Active terminal changed, name=${terminal ? terminal.name : 'undefined'}`);
			terminal.processId.then((processId) => {
				if (processId) {
					runCommand('fig bg:vscode code:' + processId)
				}
			})		//let pid = vscode.window.activeTerminal.processId
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
	// setInterval(() => {
	// 	console.log(vscode.window.activeTerminal, vscode.window.activeTextEditor, vscode.context)
	// }, 1000)
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
