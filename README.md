# Virto Commerce Mobile
Mobile starter kit for developing e-commerce related apps using Virto Commerce API. It is developed using http://ionicframework.com, angularjs and cordova.

Simple configuration (good for modifying simple html)
--------------

1. [Install the Ionic CLI]
```sh
npm install -g ionic
``` 
2. **Serving the app for testing.** Go to the root directory of the vc-mobile repository in command line. Type:
```sh
ionic serve
```
The site http://localhost:8100/ opens in browser. Navigate to http://localhost:8100/ionic-lab for mobile-like view instead. 

3. Can minimize, but don't close the command prompt.
4. Now open the project in your favourite development tool (VS, VS Code, ...) and start modifying files under www folder. All updates to html and js will be automatically synchronized.

**Note:** The project is preconfigured to use demo data from site http://demo.virtocommerce.com. You can switch to any other Virto Commerce Platform data source by changing the [Ionic CLI service proxy] in the project file. (Don't forget to point to REST API url like http://demo.virtocommerce.com/admin/api).

[Setting Virto Commerce Platform] locally.

[Install the Ionic CLI]: <http://ionicframework.com/docs/cli/install.html>
[Ionic CLI service proxy]: <http://ionicframework.com/docs/cli/test.html>
[Setting Virto Commerce Platform]: <http://docs.virtocommerce.com/display/vc2devguide/Source+Code+Getting+Started>

Advanced configuration with device emulation
--------------
1. http://taco.visualstudio.com/en-us/docs/tutorial-ionic/#getStarted
