# Forms

## Basic form

The basic form styling is applied with the `.standard-form` (and the `.login-form` for now) classes.
Each form elememnt is usually wrapped in a &lt;div class=&quot;form-group&quot;&gt;&lt;/div&gt;

%% result %%
```
<form style="width: 20em;">
  <div class="form-group">
    <div class="input-group">
      <span class="input-group-addon"><i class="fa fa-pencil fa-fw"></i></span>
      <label class="sr-only" for="field1">Optional field</label>
      <input id="field1" class="form-control" type="text" placeholder="You can leave this blank">
    </div>
  </div>
  <div class="form-group">
    <div class="input-group">
      <span class="input-group-addon"><i class="fa fa-pencil fa-fw"></i></span>
      <label class="sr-only" for="field2">Mandatory field*</label>
      <input id="field2" class="form-control" type="text" placeholder="Please fill in" required>
    </div>
  </div>
  <div class="form-group">
    <button class="btn btn-primary">Validate</button> 
  </div>
</form>
```

## Textareas

Note: 

%% result %%
```
<textarea class="form-control" name="message" rows="3" required="" placeholder="Votre message" style="width: 300px"></textarea>
<form class="standard-form">
  <div class="textarea-with-icon" style="width: 300px">
    <textarea class="form-control" id="album-description" rows="3" placeholder="Describe the album" name="albumDescription"></textarea>
    <label for="album-description"><i class="fa fa-pencil"></i></label>
  </div>
</form>
```

## Date picker field

Used when...

%% result %%
```
<form class="login-form standard-form">
  <div class="input-group" style="width: 20em">
    <span class="input-group-addon"><i class="fa fa-calendar fa-fw"></i></span>
    <input class="form-control" name="end_date" ng-attr-placeholder="{{ 'END_DATE_PLACEHOLDER' | translate }}" type="text" datepicker-popup="shortDate" is-open="datePickers.end_date.isOpen" ng-click="datePickers.end_date.isOpen=true" ng-model="formData.event.end_date" datepicker-append-to-body="true"/>
    <label class="sr-only" for="end_date">{{ "END_DATE" | translate }}*</label>
  </div>
</form>
```

## Date placeholder field

A specialized pattern placeholder field for dates.

Used for: forms for editing profile, posts, albums.

%% result %%
```
<form class="login-form standard-form">
  <fc-date-input name="birthDate" 
       data-locale="{{style.locale}}" 
       data-not-found-message="{{'fc-date-input.DATE_INVALID'|translate}}" 
       data-click-to-confirm-message="fc-date-input.CLICK_TO_CONFIRM" 
       data-is-valid="style.sampleDateModel.dateValid"
       ng-model="style.sampleDateModel.value" 
       placeholder="{{'BIRTH_DATE'|translate}}"
       style="width: 20em">
  </fc-date-input>
  <div>Updated model = {{style.sampleDateModel.value|date}}</div>
</form>
```

## Date placeholder field with hint

A specialized pattern placeholder field for dates that displays understood date.

Used for: sign-up form.

%% result %%
```
<form class="login-form standard-form">
  <fc-date-input name="birthDate" 
       data-locale="{{style.locale}}" 
       data-not-found-message="{{'fc-date-input.DATE_INVALID'|translate}}" 
       data-click-to-confirm-message="fc-date-input.CLICK_TO_CONFIRM" 
       ng-model="style.sampleHintDateModel.value" 
       data-show-output="true"
       placeholder="{{'BIRTH_DATE'|translate}}"
       style="width: 20em">
  </fc-date-input>
</form> 
<output>
  <div>Updated model = {{style.sampleHintDateModel.value|date}}</div>
</output>
```

## Buttons

### Primary button
Used for 'Confirm'/'OK' actions.

%% result %%
```
<button class="btn btn-primary">Validate</button> <button class="btn btn-primary" disabled>Validate</button>
```

### Secondary button

Used for 'Cancel'/'Discard' actions.

%% result %%
```
<button class="btn btn-secondary">Cancel</button> <button class="btn btn-secondary" disabled>Cancel</button>
```

### Danger button

Used for high-impact and/or irreversible actions like 'Delete'.

%% result %%
```
<button class="btn btn-danger">Delete</button> <button class="btn btn-danger" disabled>Delete</button>
```

### Warning button

Used when...

%% result %%
```
<button class="btn btn-warning">Resend</button> <button class="btn btn-warning" disabled>Resend</button>
```

### Button with icons

Used when...

%% result %%
```
????????????????
```


### Button input

Used when...

%% result %%
```
<button class="btn btn-input">Text</button>
```

### Fake inputs

Used when...

%% result %%
```
<a class="fake-input fake-input-expandable-height fake-input-gray">
  <i class="fa fa-users"></i>
  <i class="fa fa-angle-right"></i>
  <span>Recipients</span>
</a>
<a class="fake-input fake-input-expandable-height fake-input-green">
  <i class="fa fa-users"></i>
  <i class="fa fa-angle-right"></i>
  <span>Recipients</span>
</a>
```

### Radiobuttons

%% result %%
```
<span class="standard-radiobutton">
  <input id="male" name="gender" type="radio" value="Male" required="" checked="">
  <span class="radio-element"></span>
</span>
<label for="male" class="fa">Male*</label>
<span class="standard-radiobutton">
  <input id="female" name="gender" type="radio" value="female" required="">
  <span class="radio-element"></span>
</span>
<label for="female" class="fa">Female*</label>
```

### Checkboxes

%% result %%
```
<div class="standard-checkbox">
  <input id="notifications1" type="checkbox" checked="">
  <label for="notifications1" class="fa">
    <span>Text 1</span>
  </label>
</div>
<div class="standard-checkbox">
  <input id="notifications2" type="checkbox">
  <label for="notifications2" class="fa">
    <span>Text 2</span>
  </label>
</div>
```

### Dropdown lists

%% result %%
```
this.list = [
  {id: 0, key: 'First'},
  {id: 1, key: 'Second'},
  {id: 2, key: 'Third'}
];
this.selected = 0;
```
```
<form class="standard-form" style="width: 300px;">
 <fc-bootstrap-dropdown-select
   ng-model="style.selected" 
   preselected-item="style.selected" 
   data-dropdown-data="style.list">
 </fc-bootstrap-dropdown-select>
</form>
```

### Autocomplete dropdowns

TODO

%% result %%
```
<fc-autocomplete></fc-autocomplete>
```

### Photo upload button

?????????????

%% result %%
```
<form>
  <div class="upload-button" ng-class="{selected:isEditing &amp;&amp; isUploadedPhoto}" style="position: relative; overflow: hidden; direction: ltr;">
    <a class="btn btn-white" ng-class="{selected:isEditing &amp;&amp; isUploadedPhoto}"><span class="ng-binding"><i class="fake-input-left-icon fa fa-camera"></i> Photo</span></a>
    <input qq-button-id="175bddeb-f08a-45c0-8300-2a71dd7aeb18" type="file" name="qqfile" style="position: absolute; right: 0px; top: 0px; font-family: Arial; font-size: 118px; margin: 0px; padding: 0px; cursor: pointer; opacity: 0; height: 100%;"></div>
</form>
```
