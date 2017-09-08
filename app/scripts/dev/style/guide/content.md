# Basics

## Typography

### Available font weights

Font-family: `'PT Sans', Helvetica, sans-serif`.

%% result %%
```
<div style="font-weight: normal">normal text</div>
<div style="font-style: italic">italic text</div>
<div style="font-weight: bold">bold text</div>
```

### Headings

%% result %%
```
<h1>h1. Famicity heading</h1>
<h2>h2. Famicity heading</h2>
<h3>h3. Famicity heading</h3>
<h4>h4. Famicity heading</h4>
<h5>h5. Famicity heading</h5>
<h6>h6. Famicity heading</h6>
```

### Links

%% result %%
```
Hello, I'm a <a href="">basic link</a>.
```

## Colors

@include parts/colors.html;
@include parts/colors.md;

@include parts/components.md;
@include parts/patterns.md;

@include parts/forms.md;

# Popups

## Yes/no popin
%% result %%
```
this.openConfirmation = () => yesnopopin.open('DELETE_PHOTO_CONFIRMATION_TITLE');
```
```
<button class="btn btn-danger" ng-click="style.openConfirmation()">
  <i class="fa fa-trash"> Delete</i>
</button>
```

# External icons

## App icons

%% result %%
```
<fc-app-icons locale="{{style.locale}}"></fc-app-icons>
```

## Social icons

%% result %%
```
<div class="face-twit-function-icons">
  <div class="face-twit-function-icons-row1 clearfix">
    <a class="ui_elem face-twit-function-icon-twitter" href="https://twitter.com/famicity" target="_blank" title="Twitter"></a>
    <a class="ui_elem face-twit-function-icon-facebook" href="https://facebook.com/famicity" target="_blank" title="Facebook"></a>
    <a class="ui_elem face-twit-function-icon-pinterest" href="https://pinterest.com/famicity" target="_blank" title="Pinterest"></a>
  </div><div class="face-twit-function-icons-row2 clearfix">
    <a class="ui_elem face-twit-function-icon-mail" ui-sref="u.settings-contact" title="Famicity" href="/settings/contact"></a>
    <a class="ui_elem face-twit-function-icon-famicity" href="http://blog.famicity.com" target="_blank" title="Blog famicity"></a>
  </div>
</div>
```


# Tooltips

Note: tooltips will be styled automatically with the respective colors depending on whether they are in the public or the private part.
More info on tooltip options and parameters: <a href="http://getbootstrap.com/javascript/#tooltips" target="_blank">Bootstrap tooltips</a> (external link)

%% result %%
```
<a data-tooltip-placement="top" data-tooltip-append-to-body="true" tooltip="Voir qui a aimé cette publication" href="javascript:;">Like</a>
<div class="input-group" style="width: 300px;">
  <span class="input-group-addon"><i class="fa fa-envelope-o fa-fw"></i></span>
  <label class="sr-only" for="name">Email</label>
  <input type="password" id="login-password" name="loginPassword" class="form-control" data-tooltip-append-to-body="true" data-tooltip-trigger="focus" data-tooltip-placement="right" data-translate data-translate-attr-placeholder="YOUR_PASSWORD" tooltip-html-unsafe="Mot de passe de 6 caractères minimum." placeholder="Votre mot de passe">
</div>
<i class="fa fa-question-circle" data-tooltip-placement="right" tooltip-html-unsafe="Les informations déposées sur Famicity restent votre propriété. Aucune information ne sera publiée sur votre mur ou transmise à Facebook."></i>
```

# Pages

@include parts/tree.md;

## Feed

## Messages

## Directory ???
