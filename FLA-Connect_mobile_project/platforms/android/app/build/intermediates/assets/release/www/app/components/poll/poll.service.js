(function() {
  angular
    .module("flaMobileApp.pollPage.service", [])
    .factory("PollPageService", PollPageService);

  PollPageService.inject = [
    "$q",
    "$filter",
    "DrupalApiConstant",
    "DrupalHelperService",
    "ViewsResource",
    "FileResource",
    "NodeResource",
    "AuthenticationService"
  ];

  function PollPageService(
    $q,
    $filter,
    DrupalApiConstant,
    DrupalHelperService,
    ViewsResource,
    FileResource,
    NodeResource,
    AuthenticationService
  ) {
    var initialised = false;

    var isLangSelected = window.localStorage["language"];

    //pagination options
    paginationOptions = {};
    paginationOptions.pageFirst = 0;
    paginationOptions.pageLast = undefined;
    paginationOptions.maxPage = undefined;

    //Options for indexing nodes
    var viewsOptions = {};
    if (isLangSelected === "en") {
      viewsOptions.view_name = "anket_en";
    } else {
      viewsOptions.view_name = "anket";
    }
    viewsOptions.page = 0;
    viewsOptions.pagesize = 25;
    viewsOptions.format_output = "0";
    viewsOptions.display_id = "services_1";

    //stored poll
    var polls = [];

    //pollPage service object
    var pollPageService = {
      init: init,
      getAll: getAll,
      get: get,
      loadRecent: loadRecent,
      loadMore: loadMore,
      saveArtilce: saveArtilce,
      deletePoll: deletePoll
    };

    return pollPageService;

    /////////////////////////////////////////////////////////////

    function init() {
      var defer = $q.defer();

      retreivePolls(viewsOptions)
        .then(
          //success
          function(newPolls) {
            defer.resolve(polls);
          }
        )
        .catch(function(error) {
          defer.reject(error);
        })
        .finally(function() {
          initialised = true;
        });

      return defer.promise;
    }

    //prepare poll after fetched from server
    function preparePoll(poll) {
      if ("field_image" in poll && "und" in poll.field_image) {
        angular.forEach(poll.field_image.und, function(value, key) {
          var imgPath = poll.field_image.und[key].uri
            .split("//")[1]
            .replace(/^\/+/, "");
          poll.field_image.und[key].imgPath =
            DrupalHelperService.getPathToImgByStyle(
              DrupalApiConstant.imageStyles.medium
            ) + imgPath;
          poll.nid = parseInt(poll.nid);
        });
      }

      return poll;
    }

    //returns all polls
    //@TODO implement exposed filters for request and cache like in get
    function getAll() {
      var defer = $q.defer(),
        allFilteredSpots = undefined;

      if (polls.length > 0) {
        allFilteredSpots = polls.nid;
      } else {
        allFilteredSpots = undefined;
      }

      if (allFilteredSpots != undefined) {
        defer.resolve(allFilteredSpots);
      } else {
        return retreivePolls(viewsOptions);
      }

      return defer.promise;
    }

    //returns poll by nid
    // first it query's the cache
    // if item not in cache it fires request to server
    //filter { nid:3 }
    function get(filter) {
      var defer = $q.defer(),
        poll = undefined;

      //if a filter is given and not empty
      if (
        angular.isObject(filter) &&
        typeof Object.keys(filter)[0] !== "undefined"
      ) {
        poll = $filter("filter")(polls, filter);
        if (poll.length > 0) {
          poll = poll[0];
        }
      }

      //return poll form cache
      if (
        angular.isObject(poll) &&
        typeof Object.keys(poll)[0] !== "undefined"
      ) {
        defer.resolve(poll);
      } else {
        //setup exposed filters options
        viewsOptions.exposed_filters = filter;

        return ViewsResource.retrieve(viewsOptions).then(function(result) {
          if (result.data[0]) {
            return result.data[0];
          }
          return $q.reject(false);
        });
      }

      return defer.promise;
    }

    //loads recent polls and adds to polls array
    function loadRecent() {
      if (paginationOptions.pageFirst > 0) {
        paginationOptions.pageFirst = 0;
      }
      viewsOptions.page = paginationOptions.pageFirst;

      return retreivePolls(viewsOptions);
    }

    //loads polls and adds to polls array
    function loadMore() {
      var defer = $q.defer();

      if (paginationOptions.maxPage === undefined) {
        //start initial with 0
        (paginationOptions.pageLast =
          paginationOptions.pageLast === undefined
            ? 0
            : paginationOptions.pageLast + 1),
          (viewsOptions.page = paginationOptions.pageLast);

        return retreivePolls(viewsOptions);
      }
      //no more nodes to load
      else {
        defer.resolve(polls);
      }

      return defer.promise;
    }

    //retrieves polls from view and handle pagination
    function retreivePolls(viewsOptions) {
      console.log(viewsOptions);
      paginationOptions.pageLast =
        paginationOptions.pageLast === undefined
          ? 0
          : paginationOptions.pageLast;

      var defer = $q.defer();
      ViewsResource.retrieve(viewsOptions)
        .then(function(response) {
          // if (response.data.length != 0) {
          //   polls = mergeItems(response.data, polls, undefined, preparePoll);
          // }

          if (response.data.length == 0) {
            viewsOptions.page--;
            paginationOptions.pageLast = viewsOptions.page;
            paginationOptions.maxPage = viewsOptions.page;
          }
          
          var filteredPoll = [];
          var today = new Date();
          for (var i = 0; i < response.data.length; i++) {
            var poll = response.data[i];
            var startDate = new Date(poll.advpoll_dates.und[0].value);
            var endDate = new Date(poll.advpoll_dates.und[0].value2);

            if (startDate <= today && endDate >= today) {
              filteredPoll.push(poll);
            }
          }
          polls = filteredPoll;
          defer.resolve(polls);
        })
        .catch(function(error) {
          defer.reject(error);
        });

      return defer.promise;
    }

    //saves poll and optional image
    //returns promise
    function saveArtilce(poll) {
      var preparedPoll = angular.merge({}, poll);

      var field_biz_geocodeData = {
        bottom: "48.193302200000",
        geo_type: "point",
        geohash: "u2ed5v743dstd",
        geom: "POINT (16.3408603 48.1933022)",
        lat: "48.193302200000",
        left: "16.340860300000",
        lon: "16.340860300000",
        right: "16.340860300000",
        top: "48.193302200000"
      };

      preparedPoll.field_biz_geocodeData = DrupalHelperService.structureField(
        field_biz_geocodeData
      );

      return trySaveOptionalImage()
        .then(
          function(result) {
            preparedPoll.field_image = DrupalHelperService.structureField({
              fid: result.data.fid
            });
          },
          function(error) {
            //resolve without image
            return $q.resolve(true);
          }
        )
        .finally(function() {
          return NodeResource.create(preparedPoll);
        });

      ///////////

      //returns promise
      // - resolve after saved image to server
      // - rejects if saving image fails or no image given
      function trySaveOptionalImage() {
        //if data is given
        if (preparedPoll.field_image.base64) {
          var imgData = preparedPoll.field_image.base64;
          delete preparedPoll.field_image.base64;

          var newImage = {};

          newImage.file = imgData;
          newImage.filename = "drupal.jpg";
          newImage.filesize = newImage.file.length;
          newImage.filepath = "field/image/";
          (newImage.filemime = "image/jpeg"),
            (newImage.image_file_name = "drupal.jpg");

          return FileResource.create(newImage);
        }

        //else fail
        return $q.reject(false);
      }
    }

    function deletePoll(poll) {
      return NodeResource.delete(poll);
    }

    function mergeItems(newItems, currentItems, type, callback) {
      callback =
        typeof callback === "function"
          ? callback
          : function(obj) {
              return obj;
            };

      if (!type) {
        var uniqueNodes = [];
        var isUnique;
        angular.forEach(
          newItems,
          function(newItems) {
            isUnique = true;
            angular.forEach(
              currentItems,
              function(currentItem, key) {
                if (newItems.nid == currentItem.nid) {
                  isUnique = false;
                }
              },
              isUnique
            );

            if (isUnique) {
              uniqueNodes.push(callback(newItems));
            }
          },
          uniqueNodes
        );

        currentItems = uniqueNodes.concat(currentItems);

        return currentItems;
      } else {
        angular.forEach(newItems, function(newItem) {
          //@TODO add this to if => || currentItems[newItem[type]].updated > newItem.updated
          if (!currentItems[newItem[type]]) {
            currentItems[parseInt(newItem[type])] = callback(newItem);
          }
        });
        return currentItems;
      }
    }
  }
})();
