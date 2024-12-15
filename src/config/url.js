function urlFromTemplate(urlTemplate, urlParams) {
  return urlTemplate.replace(/{(\w+)}/g, function(match, key) {
    return urlParams[key];
  });
}

export default urlFromTemplate