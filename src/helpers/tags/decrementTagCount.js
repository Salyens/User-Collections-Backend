const decrementTagCount = (tagsToDecrement, doc) => {
    if (!tagsToDecrement || !tagsToDecrement.length) return doc;
    tagsToDecrement.forEach((tag) => {
      if (!doc.tags[tag]) return; 
      doc.tags[tag].itemCount--;
      if (doc.tags[tag].itemCount < 1) delete doc.tags[tag];
    });
    return doc;
  };
  
  module.exports = decrementTagCount;

      // if (tagsToDecrement && tagsToDecrement.length) {
    //     tagsToDecrement.forEach((tag) => {
    //       if (doc.tags[tag]) {
    //         if (doc.tags[tag].itemCount - 1 < 1) delete doc.tags[tag];
    //         else doc.tags[tag].itemCount--;
    //       }
    //     });
    //   }