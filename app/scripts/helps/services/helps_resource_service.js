angular.module('famicity').factory('Help', function($resource, configuration, resourceTransformer) {
  'use strict';

  const categoriesData = {
    home: {icon: 'home', order: 0},
    profile: {icon: 'user', order: 1},
    tree: {icon: 'leaf', order: 2},
    gedcom: {icon: 'leaf', order: 3},
    fusions: {icon: 'link', order: 4},
    biography: {icon: 'pencil-square-o', order: 5},
    contacts: {icon: 'book', order: 6},
    invitations: {icon: 'envelope-o', order: 7},
    albums: {icon: 'picture-o', order: 8},
    blog: {icon: 'pencil', order: 9},
    comments: {icon: 'comment-o', order: 10},
    events: {icon: 'calendar', order: 11},
    chat: {icon: 'comments-o', order: 12},
    parameters: {icon: 'gear', order: 13},
    rights: {icon: 'lock', order: 14},
    articles: {icon: 'copy', order: 15}
  };

  return $resource(configuration.api_url + '/helps/:answer_id', {answer_id: '@answer_id'},
    {
      page: {
        isArray: true,
        params: {
          category_id: '@category_id'
        },
        url: configuration.api_url + '/helps/:category_id/page',
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'questions', status)
      },
      get: {
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'answer', status)
      },
      search: {
        isArray: true,
        params: {
          search_string: '@search_string'
        },
        url: configuration.api_url + '/helps/search/:search_string',
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'helps', status)
      },
      categories: {
        isArray: true,
        url: configuration.api_url + '/helps/categories',
        transformResponse: (data) => {
          data = JSON.parse(data);
          data = data.reduce(function(categories, category) {
            category.count = parseInt(category.count, 10);
            if (category.count && category.count > 0) {
              category.icon = categoriesData[category.name].icon;
              category.order = categoriesData[category.name].order;
              categories.push(category);
            }
            return categories;
          }, []).sort(function(a, b) {
            return a.order - b.order;
          });
          return data;
        }
      }
    });

});
