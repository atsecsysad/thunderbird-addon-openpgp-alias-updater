/* global ExtensionCommon, IOUtils, PathUtils */

var moveFile = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      moveFile: {
        async moveFile(sourcePath, json_filename) {
          await IOUtils.move(sourcePath, PathUtils.join(PathUtils.profileDir, json_filename));
        }
      }
    }
  }
};
