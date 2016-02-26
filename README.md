# Virto Commerce Mobile
Mobile starter kit for developing e-commerce related apps using Virto Commerce API. It is developed using Ionic Framework, AngularJS and Cordova.

Simple configuration (good for modifying simple html)
--------------

0. [Install the Ionic CLI]
```sh
npm install -g ionic
``` 
1. Open the project in your favorite development tool (VS, VS Code, ...). In case of Visual Studio 2015, it should restore the required npm and bower packages in background automatically.
2. **Serve the app for testing.** Go to the root directory of the vc-mobile repository in command prompt. Type:
```sh
ionic serve --lab
```
The site http://localhost:8100/ionic-lab opens in browser with iOS and Android devices emulated.
3. Check and test the app running. 
4. Can minimize, but don't close the command prompt.
5. Start modifying source code files under www folder. All updates to html and js will be automatically synchronized in browser.

**Note:** The project is preconfigured to use demo data from site http://demo.virtocommerce.com. You can switch to any other Virto Commerce Platform data source by changing the [Ionic CLI service proxy] in the project file. (Don't forget to point to REST API url like http://demo.virtocommerce.com/storefrontapi).

[Setting Virto Commerce Platform] locally.

[Install the Ionic CLI]: <http://ionicframework.com/docs/cli/install.html>
[Ionic CLI service proxy]: <http://ionicframework.com/docs/cli/test.html>
[Setting Virto Commerce Platform]: <http://docs.virtocommerce.com/display/vc2devguide/Source+Code+Getting+Started>

Advanced configuration with device emulation
--------------
1. http://taco.visualstudio.com/en-us/docs/tutorial-ionic/#getStarted
