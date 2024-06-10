export function getModelViewerUrl(version?: string) {
  if (!version) {
    return 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
  }

  const regexGetVersion = /(\d+\.\d+)(\.\d+)?/;

  const result = regexGetVersion.exec(version);

  if (!result) {
    throw new Error(
      `"${version}" was not valid version. Example version: 1.10`,
    );
  }

  const majorMinor = result[1];

  return `https://ajax.googleapis.com/ajax/libs/model-viewer/${majorMinor}/model-viewer.min.js`;
}
