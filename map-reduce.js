(function (exports, undefined) {

  var _ = wrap;
  _.wrap = wrap;
  _.forEach = forEach;
  _.map = map;
  _.filter = filter;
  _.flatten = _.concatAll = concatAll;
  _.concatMap = concatMap;
  _.reduce = reduce;
  _.zip = zip;

  exports._ = _;

  return;

  function wrap(ar) {
    var unwrap = function () {
      return ar;
    };
    unwrap.unwrap = unwrap;
    unwrap.forEach = function (fn) {
      forEach(ar, fn);
      return wrap(ar);
    };
    unwrap.map = function (fn) {
      var result = map(ar, fn);
      return wrap(result);
    };
    unwrap.filter = function (fn) {
      var result = filter(ar, fn);
      return wrap(result);
    };
    unwrap.concatAll = function () {
      var result = concatAll(ar);
      return wrap(result);
    };
    unwrap.flatten = function () {
      var result = flatten(ar);
      return wrap(result);
    };
    unwrap.concatMap = function (fn) {
      var result = concatMap(ar, fn);
      return wrap(result);
    };
    unwrap.reduce = function (combinerFn, initVal) {
      var result = reduce(ar, combinerFn, initVal);
      return wrap(result);
    };
    return unwrap;
  };

  function forEach(ar, fn) {
    for (var i = 0, l = ar.length; i < l; ++i) {
      var o = ar[i];
      fn.apply(ar, [o, i, ar]);
    }
  };

  function map(ar, fn) {
    var results = [];
    forEach(ar, function (o, i, ar) {
      var result = fn.apply(ar, [o, i, ar]);
      results.push(result);
    });
    return results;
  };

  function filter(ar, fn) {
    var results = [];
    forEach(ar, function (o, i, ar) {
      var passed = fn.apply(ar, [o, i, ar]);
      if (passed) {
        results.push(o);
      }
    });
    return results;
  };

  function concatAll(ar) {
    var flat = [];
    forEach(ar, function (subAr) {
      forEach(subAr, function (o) {
        flat.push(o);
      });
    });
    return flat;
  };

  function concatMap(ar, fn) {
    var mapped = map(ar, function (o, i, ar) {
      return fn.apply(ar, [o, i, ar]);
    });
    return concatAll(mapped);
  };
  
  function reduce(ar, combinerFn, initVal) {
    if (!ar.length) {
      return [];
    }
    var i, acc;
    if (arguments.length >= 3) {
      i = 0;
      acc = initVal;
    } else {
      i = 1;
      acc = ar[0];
    }
    for (var l = ar.length; i < l; ++i) {
      var cur = ar[i];
      acc = combinerFn.apply(ar, [acc, cur]);
    }
    return [acc];
  }

  function zip(ar1, ar2, combinerFn) {
    var results = [];
    for (var i = 0, l = Math.min(ar1.length, ar2.length); i < l; ++i) {
      var combination = combinerFn(ar1[i], ar2[i]);
      results.push(combination);
    }
    return results;
  }

  /* // Test data
  var movieLists = [
      {
        name: "Instant Queue",
        videos : [
          {
            "id": 70111470,
            "title": "Die Hard",
            "boxarts": [
              { width: 150, height:200, url:"http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" },
              { width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/DieHard200.jpg" }
            ],
            "url": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 4.0,
            "bookmark": []
          },
          {
            "id": 654356453,
            "title": "Bad Boys",
            "boxarts": [
              { width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg" },
              { width: 150, height:200, url:"http://cdn-0.nflximg.com/images/2891/BadBoys150.jpg" }

            ],
            "url": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 5.0,
            "bookmark": [{ id:432534, time:65876586 }]
          }
        ]
      },
      {
        name: "New Releases",
        videos: [
          {
            "id": 65432445,
            "title": "The Chamber",
            "boxarts": [
              { width: 150, height:200, url:"http://cdn-0.nflximg.com/images/2891/TheChamber150.jpg" },
              { width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg" }
            ],
            "url": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 4.0,
            "bookmark": []
          },
          {
            "id": 675465,
            "title": "Fracture",
            "boxarts": [
              { width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
              { width: 150, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture150.jpg" },
              { width: 300, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" }
            ],
            "url": "http://api.netflix.com/catalog/titles/movies/70111470",
            "rating": 5.0,
            "bookmark": [{ id:432534, time:65876586 }]
          }
        ]
      }
    ];
  */

  /* // Test 1
  _.wrap(movieLists).concatMap(function (movieList) {
    return _.wrap(movieList.videos).concatMap(function (video) {
      return _.wrap(video.boxarts).filter(function (boxart) {
        return boxart.width === 150;
      }).map(function (boxart) {
        return {id: video.id, title: video.title, boxart: boxart.url};
      }).unwrap();
    }).unwrap();
  }).unwrap();
  */

  /* // Test 2
  _(movieLists).concatMap(function (movieList) {
    return _(movieList.videos).concatMap(function (video) {
      return _(video.boxarts).filter(function (boxart) {
        return boxart.width === 150;
      }).map(function (boxart) {
        return {id: video.id, title: video.title, boxart: boxart.url};
      })();
    })();
  })();
  */

  /* // Test 3
  _([1,3,5,4,2]).reduce(function (acc, cur) {
    return acc > cur ? acc : cur;
  })();
  */

  /* // Test 4
  _.zip([1,2,3,4], ['a', 'b', 'c'], function (left, right) {
    var o = {};
    o[right] = left;
    return o;
  });
  */

})(window);
