angular.module('famicity')
  .config(function($stateProvider) {
    'use strict';
    return $stateProvider
      .state('u.blog', {
        url: '/users/:user_id/blog',
        abstract: true,
        resolve: {
          profile: (profileService, $stateParams) => profileService.getShortProfile($stateParams.user_id),
          breadcrumbTitle: function(profile, $translate) {
            const bread = profile && profile.is_deceased ? 'BIOGRAPHY' : 'DIARY';
            return $translate.instant(bread);
          }
        }
      })
      .state('u.blog.query', {
        url: '',
        views: {
          '@': {
            templateUrl: '/scripts/blog/Blog.html',
            controller: 'BlogController'
          }
        },
        resolve: {
          menu: ($q, $stateParams, navigation, menuBuilder, profile) => {
            return $q(function(resolve) {
              const userId = profile.id;
              const menu = menuBuilder.newMenu();
              if (profile.permissions.is_updatable) {
                menu.withAction({
                  onActive: () => navigation.go('u.blog-add', {user_id: userId}),
                  label: '+'
                });
              }
              resolve(menu.build());
            });
          }
        },
        data: {
          stateClass: 'blog'
        },
        ncyBreadcrumb: {
          label: '{{ breadcrumbTitle }}'
        }
      })
      .state('u.blog-add', {
        url: '/users/:user_id/blog/add',
        views: {
          '@': {
            templateUrl: '/scripts/blog/post/add/BlogPostAdd.html',
            controller: 'BlogPostAddController'
          }
        },
        ncyBreadcrumb: {
          parent: 'u.blog.query',
          label: '{{ \'NEW_POST\' | translate }}'
        },
        data: {
          authorizedFormRoutes: ['add_post']
        }
      })
      .state('u.blog.get', {
        url: '/posts/:post_id/show?show_comments&isEditing',
        views: {
          '@': {
            templateUrl: '/scripts/blog/show/BlogPostShow.html',
            controller: 'BlogPostShowController'
          }
        },
        resolve: {
          post: (postService, $stateParams, menuBuilder, navigation, $q) => $q((resolve) => postService.get($stateParams.post_id, $stateParams.user_id).then((post) => {
            const userId = $stateParams.user_id;
            const postId = $stateParams.post_id;
            const menu = menuBuilder.newMenu();
            const editAction = {
              icon: 'fa fa-edit',
              onActive: () => navigation.go('u.blog.get', {user_id: userId, post_id: postId, isEditing: true})
            };
            if (post.permissions.is_updatable) {
              menu.withAction(editAction);
            }
            menu.build();
            if ($stateParams.isEditing) {
              postService.edit(postId, userId).then((editCopy) => {
                post.editCopy = editCopy;
                post.formStatus = {
                  isEditing: true
                };
                resolve(post);
              });
            } else {
              resolve(post);
            }
          }))
        },
        ncyBreadcrumb: {
          parent: 'u.blog.query',
          label: '{{ post.story ? \'STORY.LEFT_BLOCK.TITLE\' : \'POST\' | translate:({month: post.story.month, vowel: story.vowel}):\'messageformat\' }}'
        }
      })
      .state('u.user-posts-likes', {
        url: '/users/:user_id/posts/:post_id/likes',
        views: {
          '@': {
            templateUrl: '/scripts/blog/views/posts_likes.html',
            controller: 'InternalUserPostsLikesController'
          }
        },
        resolve: {
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        ncyBreadcrumb: {
          parent: 'u.blog.get',
          label: '{{ \'THEY_LIKE_POST\' | translate }}'
        }
      });
  });
