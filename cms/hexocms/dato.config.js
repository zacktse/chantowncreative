// dato.config.js

// module.exports = (dato, root, i18n) => {
//   // within a 'content' directory...
//   root.directory('./content', dir => {
//
//     // dump the global DatoCMS site setting into a 'site.yml' file
//     dir.createDataFile(
//       'site.yml',
//       'yaml',
//       dato.site.toMap()
//     );
//
//     // for each Item Type present in the DatoCMS backend...
//     dato.itemTypes.forEach(itemType => {
//
//       // dump the items in the collection into a YAML file
//       dir.createDataFile(
//         `${itemType.apiKey}.yml`,
//         'yaml',
//         dato.itemsOfType(itemType).map(item => item.toMap())
//       );
//     });
//   });
// };

module.exports = (dato, root, i18n) => {
  root.createDataFile('portfolioImages.json', 'json', dato.portfolioImages.map(item => {
    return {
      title: item.title,
      year: item.year,
      category: item.category,
      srcImage: item.image.url({ w: 400, fm: 'jpg' }),
      mobileImage: {
        src: item.image.url({ w: 800, fm: 'jpg' }),
        width: 800,
        height: parseInt(800 / item.image.width * item.image.height)
      },
      desktopImage: {
        src: item.image.url({ w: 2000, fm: 'jpg' }),
        width: 800,
        height: parseInt(2000 / item.image.width * item.image.height)
      },
      description: item.image.title,
      alt: item.image.alt,
    };
  }));
};
