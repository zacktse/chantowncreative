module.exports = (dato, root, i18n) => {

  let buildPaddedGalleryJson = (images) => {
    let imagesArray = images.map(item => {
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
          width: 2000,
          height: parseInt(2000 / item.image.width * item.image.height)
        },
        description: item.image.title,
        alt: item.image.alt,
      };
    });

    return {
      "images" : imagesArray
      }
  };

  let buildPaddedClientsJson = (images) => {
    let clientsArray = images.map(item => {
      return {
        title: item.title,
        image: item.image.url({ w: 400, fm: 'jpg' }),
        description: item.image.title,
        alt: item.image.alt,
      };
    });

    return {
      "clients" : clientsArray
    }
  };

  let buildPaddedBooksJson = (items) => {
    let booksArray = items.map(item => {
      return {
        title: item.title,
        image: item.thumbnail.url({ w: 200, fm: 'jpg' }),
        description: item.thumbnail.title,
        alt: item.thumbnail.alt,
        url: item.externalLink
      };
    });

    return {
      "books" : booksArray
    }
  };

  dato.portfolioImages
    root.createDataFile('source/js/json/portfolioImages.json', 'json', buildPaddedGalleryJson(dato.portfolioImages));

  dato.clients
    root.createDataFile('source/js/json/clients.json', 'json', buildPaddedClientsJson(dato.clients));

  dato.books
    root.createDataFile('source/js/json/books.json', 'json', buildPaddedBooksJson(dato.books));

};
