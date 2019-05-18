// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vue-i18n-manage" is now active!'
  );

  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Hello Vue-i18n-manage!");
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand("catCoding.start", () => {
      const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

      if (currentPanel) {
        currentPanel.reveal(columnToShowIn);
      } else {
        // Create and show a new webview
        currentPanel = vscode.window.createWebviewPanel(
          "catCoding",
          "Cat Coding",
          vscode.ViewColumn.One,
          {
            enableScripts: true
          }
        );
      }

      currentPanel.webview.html = getWebViewContent();
      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions
      );

      currentPanel.onDidChangeViewState(
        event => {
          console.log("event.changed", event.webviewPanel);
        },
        null,
        context.subscriptions
			);
			
			currentPanel.webview.onDidReceiveMessage(message=>{
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						break;
				}
			},null,context.subscriptions);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("catCoding.doRefactor", () => {
      if (!currentPanel) {
        return;
      }
      currentPanel.webview.postMessage({ command: "refactor" });
    })
  );
}

function getWebViewContent() {
  return `<!DOCTYPE html>
	<html lang='en'>
		<head>
			<meta charset='utf-8'/>
			<meta name='viewport' content='width="device-width,initial-scale=1.0"'/>
			<title>lang</title>
			</head>
			<body>
				<select>
					<option>EN</option>
					<option>CN</option>
				</select>
				<h1 id="lines-of-code-counter">0</h1>
				<script>
					const counter = document.getElementById('lines-of-code-counter');

					let count = 0;
					const timer = setInterval(() => {
							counter.textContent = count++;
							if (Math.random() < 0.001 * count) {
									vscode.postMessage({
											command: 'alert',
											text:count
									})
							}
					}, 100);

					window.addEventListener('message', event => {
            const message = event.data; // The JSON data our extension sent
            switch (message.command) {
                case 'refactor':
                    count = Math.ceil(count * 0.5);
                    counter.textContent = count;
                    break;
            }
        });
    		</script>
			</body>
	</html>`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
