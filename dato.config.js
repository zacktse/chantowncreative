module.exports = (dato, root, i18n) => {

  let buildPaddedPortfolioJson = (images) => {

    let imagesArray = [];

    images.forEach(item => {
      if(item.portfolio) {
        imagesArray.push({
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
            description: item.description,
            alt: item.image.alt,
            showInPortfolio: item.portfolio
          });
      }

    });
    return {
      "images" : imagesArray
    }
  };

  let buildPaddedGalleryJson = (images) => {

    let imagesArray = [];

    images.forEach(item => {
      imagesArray.push({
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
          description: item.description,
          alt: item.image.alt,
          showInPortfolio: item.portfolio
        });
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

  let buildPaddedIconsJson = (images) => {
    let iconsArray = images.map(item => {
      return {
        title: item.title,
        url: item.linkUrl,
        image: item.image.url({ w: 100, fm: 'png' }),
        description: item.image.title,
        alt: item.image.alt,
      };
    });

    return {
      "icons" : iconsArray
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
      studioChantownLogo: {
        mobileUrl: p.studioChantownLogo.url({w:300, fm: 'png'}),
        desktopUrl: p.studioChantownLogo.url({w:600, fm: 'png'}),
        alt: p.studioChantownLogo.alt
      },
      studioChantownTitle: p.studioChantownSectionTitle,
      studioChantownLeaderText: p.studioChantownLeaderText,
      studioChantownBodyCopy: p.studioChantownBodyCopy,
      studioChantownMoreLink: p.studioChantownMoreLink,
      chantownCreativeLogo: {
        mobileUrl: p.chantownCreativeLogo.url({w:300, fm: 'png'}),
        desktopUrl: p.chantownCreativeLogo.url({w:600, fm: 'png'}),
        alt: p.chantownCreativeLogo.alt
      },
      chantownCreativeTitle: p.chantownCreativeSectionTitle,
      chantownCreativeLeaderText: p.chantownCreativeLeaderText,
      chantownCreativeBodyCopy: p.chantownCreativeBodyText,
      chantownCreativeMoreLink: p.chantownCreativeMoreLink,
      contactSectionTitle: p.contactSectionTitle,
      contactSectionTextNextToImage: p.contactSectionTextNextToImage,
      contactImage: {
        mobileUrl: p.contactImage.url({w:600, fm: 'png'}),
        desktopUrl: p.contactImage.url({w:600, fm: 'png'}),
        alt: p.contactImage.alt
      },
      contactSectionBodyCopy: p.contactSectionBodyText
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
      chantownCreativeLogo: {
        mobileUrl: p.chantownCreativeLogo.url({w:300, fm: 'png'}),
        desktopUrl: p.chantownCreativeLogo.url({w:600, fm: 'png'}),
        alt: p.chantownCreativeLogo.alt
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
      featuredImage: {
        mobileUrl: p.featuredImage.url({w: 600, fm: 'jpg'}),
        desktopUrl: p.featuredImage.url({w: 1000, fm: 'jpg'}),
        title: p.featuredImage.title,
        alt: p.featuredImage.alt
      },
      cocktailParty: {
        mobileUrl: p.cocktailPartyHeaderImage.url({w: 600, fm: 'png'}),
        desktopUrl: p.cocktailPartyHeaderImage.url({w: 1000, fm: 'png'}),
        title: p.cocktailPartyHeaderImage.title,
        alt: p.cocktailPartyHeaderImage.alt
      },
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



  dato.artworks
    root.createDataFile('source/js/json/portfolioImages.json', 'json', buildPaddedPortfolioJson(dato.artworks));

  dato.artworks
    root.createDataFile('source/js/json/fullGalleryImages.json', 'json', buildPaddedGalleryJson(dato.artworks));

  dato.clients
    root.createDataFile('source/js/json/clients.json', 'json', buildPaddedClientsJson(dato.clients));
  
  dato.icons
    root.createDataFile('source/js/json/customIcons.json', 'json', buildPaddedIconsJson(dato.socialIcons));

  dato.books
    root.createDataFile('source/js/json/books.json', 'json', buildPaddedBooksJson(dato.books));

  dato.homePage
    root.createDataFile('source/js/json/homePage.json', 'json', buildHomePageJson(dato.homePage) );

  dato.consultPage
    root.createDataFile('source/js/json/consultPage.json', 'json', buildConsultPageJson(dato.consultPage) );

  dato.createPage
    root.createDataFile('source/js/json/createPage.json', 'json', buildCreatePageJson(dato.createPage) );

  dato.contactPage
    root.createDataFile('source/js/json/contactPage.json', 'json', buildContactPageJson(dato.contactPage) );

};
