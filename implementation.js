var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");


var moveFile = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      moveFile: {
        async moveFile(sourcePath, json_filename) {
        	IOUtils.move(sourcePath, PathUtils.join(PathUtils.profileDir, json_filename));
        }
      }
    }
  }
};
