
# Components

### Icons

Clickable and non-clickable

%% result %%
```
<span class="wcs-g-icon wcs-g-icon-green pull-left"><i class="fa fa-envelope-o"></i></span>
<span class="wcs-g-icon wcs-g-icon-red pull-left"><i class="fa fa-lock"></i></span>
<a class="btn btn-icon btn-icon-primary standard-icon pull-left" href="javascript:;">
  <i class="fc fc-users-plus"></i>
</a>
<a class="btn btn-icon btn-icon-danger standard-icon pull-left" href="javascript:;">
  <i class="fa fa-trash-o"></i>
</a>
<a class="btn btn-icon btn-icon-danger-inverted standard-icon pull-left" href="javascript:;">
  <i class="fa fa-trash-o"></i>
</a>
<a class="btn btn-icon btn-icon-primary btn-plus standard-icon pull-left" href="javascript:;">+</a>
<a class="btn btn-icon btn-icon-primary btn-plus standard-icon pull-left" href="javascript:;">-</a>
<a tooltip-append-to-body="true" tooltip-placement="bottom" class="btn btn-icon btn-icon-primary standard-icon pull-left" href="javascript:;" tooltip="Ajouter un proche"><i class="fc fc-plus"></i></a>
<a class="btn btn-icon btn-icon-primary next-icon-button-big pull-left" href="javascript:;"><i class="fa fa-angle-left"></i></a>
<a class="btn btn-icon btn-icon-primary next-icon-button-big pull-left" href="javascript:;"><i class="fa fa-angle-right"></i></a>
```

### Toolbar

Used in tree view (for both actions and zooming), but also in all pages menus (see [Menu](/dev/style/guide#patterns)). 

%% result %%
```
<div class="tree">
  <div class="toolbar-container main-container">
    <fc-toolbar class="main-toolbar" choices="style.toolbarChoices" tooltip-placement="bottom" max="2"></fc-toolbar>
  </div>
</div>
```

### Tabs

// TODO: simplify tabs, by removing useless &lt;span&gt; ?

%% result %%
```
this.tabActive = '1';
```
```
<ul class="standard-tabs standard-tabs-2 clearfix">
	<li ng-class="{'standard-tabs-activetab': style.tabActive == '1'}">
	  <span><a href="" ng-click="style.tabActive = '1'"><i class="fa fa-user"></i> First</a></span>
	</li>
	<li ng-class="{'standard-tabs-activetab': style.tabActive == '2'}">
	  <span><a href="" ng-click="style.tabActive = '2'"><i class="fa fa-users"></i> Second</a></span>
	</li>
</ul>
<div ng-if="style.tabActive=='1'">
  First tab
</div>
<div ng-if="style.tabActive=='2'">
  Second tab
</div>
```

### Breadcrumbs

%% result %%
```
<ncy-breadcrumb></ncy-breadcrumb>
```

### User avatars

%% result %%
```
this.user = {
  id: 1,
  global_state: 'active',
  user_name: 'Jérôme Beau',
  avatar_url: 'https://placekitten.com/g/500/500'
};
```
```
<fc-avatar user="style.user"></fc-avatar>
<fc-avatar user="style.user2"></fc-avatar>
<fc-avatar user="style.user3"></fc-avatar>
```

### Tooltip-popup

%% result %%
```
<fc-tooltip-popup>
  <p><i translate>DIRECTORY.INVITATION.BETTER_NOT_ALONE</i></p>
  <span class="center-text" translate>DIRECTORY.INVITATION.BETTER_NOT_ALONE_INVITE_THEM</span>
  <a href="" translate>HOME.HAS_FEW_CONTACTS.TOOLTIP.CLICK_HERE</a>
</fc-tooltip-popup>
```

### Bottom alert popin

%% result %%
```
this.success = () => notification.add('CONNEXION_SUCCESS_MSG', 'alert-success');
this.error = () => notification.add('INVALID_FORM', 'alert-danger');
```
```
<a href="" ng-click="style.success()">Toggle success notification</a> <br/>
<a href="" ng-click="style.error()">Toggle error notification</a>
```


### Side icon-and-text menu

As seen on the Help screen.......

?????????????

%% result %%
```
<div class="help-navigation left-navigation-icons panel-group hidden-xs" id="accordion">
  <div ng-repeat="menu in menus" class="panel panel-default" ng-class="{'help-navigation-selected': (currentCategory == menu.page)}">
    <div class="panel-heading">
      <a ng-if="pageType == 'public'" ui-sref="public.helps-category({ category_id: menu.page, locale: locale })">
        <i ng-class="'fa fa-' + menu.icon"></i>
        <h5>{{ "HELP_MENU_ITEM." + menu.page | translate }}</h5>
      </a>
      <a ng-if="pageType == 'private'" ui-sref="u.helps-category-private({ category_id: menu.page, user_id: userId })">
        <i ng-class="'fa fa-' + menu.icon"></i>
        <h5>{{ "HELP_MENU_ITEM." + menu.page | translate }}</h5>
      </a>
    </div>
  </div>
</div>
```

### Text next to picture

?????????????
