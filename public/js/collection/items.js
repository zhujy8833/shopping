define(["backbone", "model/item", "backbone.paginator"], function(Backbone, Item){
    var PaginatedItems = Backbone.Paginator.requestPager.extend({

        initialize : function(){
            var collection = this;
        },
        model : Item,
        url : "items",
        paginator_core: {
	      // the type of the request (GET by default)
	      type: 'GET',

	      // the type of reply (jsonp by default)
	      dataType: 'json',

	      // the URL (or base URL) for the service
	      // if you want to have a more dynamic URL, you can make this a function
	      // that returns a string
	      url: 'items'
	    },
        paginator_ui: {
	      // the lowest page index your API allows to be accessed
	      firstPage: 0,

	      // which page should the paginator start from
	      // (also, the actual page the paginator is on)
	      currentPage: 0,

	      // how many items per page should be shown
	      perPage: 10,

	      // a default number of total pages to query in case the API or
	      // service you are using does not support providing the total
	      // number of pages for us.
	      // 10 as a default in case your service doesn't return the total
	      totalPages: 10
	    },
	    server_api: {
	      // the query field in the request
	      'filter': '',

	      // number of items to return per request/page
	      'limit': function() { return this.perPage },

	      // how many results the request should skip ahead to
	      // customize as needed. For the Netflix API, skipping ahead based on
	      // page * number of results per page was necessary.
	      'skip': function() { return this.currentPage * this.perPage },

	      // field to sort by
	      'sort': 'created_on',

	      // what format would you like to request results in?
	      'format': 'json'

	    },
	    parse: function (response) {
            // Be sure to change this based on how your results
            // are structured (e.g d.results is Netflix specific)
            var items = response;
            //Normally this.totalPages would equal response.d.__count
            //but as this particular NetFlix request only returns a
            //total count of items for the search, we divide.
            this.totalPages = Math.ceil(items.length / this.perPage);
            if(items.length === 0){
                this.isFinished = true;
            }
            return items;
        }
    });

    return PaginatedItems;
})