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
        showInPortfolio: item.showInPortfolio
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

  let buildHomePageJson = (p) => {
    let pageData =
    {
      featuredImage: {
          mobileUrl: p.featuredImage.url({w: 600, fm: 'jpg'}),
          desktopUrl: p.featuredImage.url({w: 1000, fm: 'jpg'}),
          title: p.featuredImage.title,
          alt: p.featuredImage.alt
      },
      h1: p.h1,
      leader: p.leaderText,
      main: p.mainContentHtml,
      link1: p.link1,
      link2: p.link2
    }

    return pageData
  };

  let buildConsultPageJson = (p) => {
    let pageData =
    {
      featuredImage: {
          mobileUrl: p.featuredImage.url({w: 600, fm: 'jpg'}),
          desktopUrl: p.featuredImage.url({w: 1000, fm: 'jpg'}),
          title: p.featuredImage.title,
          alt: p.featuredImage.alt
      },
      h1: p.h1,
      leader: p.leaderText,
      content1: p.contentSection1,
      content2: p.contentSection2,
      clientText: p.clientsSectionText,
    }

    return pageData
  };

  let buildCreatePageJson = (p) => {
    let pageData =
    {
      featuredImage: {
          mobileUrl: p.featuredImage.url({w: 600, fm: 'jpg'}),
          desktopUrl: p.featuredImage.url({w: 1000, fm: 'jpg'}),
          title: p.featuredImage.title,
          alt: p.featuredImage.alt
      },
      h1: p.h1,
      leader: p.leaderText,
      content: p.pageContent
    }
    return pageData
  };

  let buildContactPageJson = (p) => {
    let pageData =
    {
      h1: p.h1,
      leader: p.leaderText,
      content: p.contentText,
      buttonText: p.buttonText,
      bioImage: {
          mobileUrl: p.bioImage.url({w: 400, fm: 'jpg'}),
          desktopUrl: p.bioImage.url({w: 600, fm: 'jpg'}),
          title: p.bioImage.title,
          alt: p.bioImage.alt
      },
      bioTitle: p.bioTitle,
      bioText: p.bioText,
      bioTextUnder: p.bioTextUnderImage,
    }
    return pageData
  };

  root.createDataFile('source/js/json/portfolioImages.json', 'json', buildPaddedGalleryJson(dato.gallery_image));
  // dato.gallery
  //   root.createDataFile('source/js/json/portfolioImages.json', 'json', buildPaddedGalleryJson(dato.gallery));

  // dato.clients
  //   root.createDataFile('source/js/json/clients.json', 'json', buildPaddedClientsJson(dato.clients));
  //
  // dato.books
  //   root.createDataFile('source/js/json/books.json', 'json', buildPaddedBooksJson(dato.books));
  //
  // dato.homePage
  //   root.createDataFile('source/js/json/homePage.json', 'json', buildHomePageJson(dato.homePage) );
  //
  // dato.consultPage
  //   root.createDataFile('source/js/json/consultPage.json', 'json', buildConsultPageJson(dato.consultPage) );
  //
  // dato.createPage
  //   root.createDataFile('source/js/json/createPage.json', 'json', buildCreatePageJson(dato.createPage) );
  //
  // dato.contactPage
  //   root.createDataFile('source/js/json/contactPage.json', 'json', buildContactPageJson(dato.contactPage) );

};
