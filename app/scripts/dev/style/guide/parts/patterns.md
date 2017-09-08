# Patterns

## Menus

### Menu

A composition of [breadcrumb](/dev/style/guide#breadcrumb) + [toolbar](/dev/style/guide#toolbar) that displays in nearly all contents pages. 
The same menu displays differently on reduced width (tablet, mobile).

%% result %%
```
<fc-menu></fc-menu>
```

## Left column blocks

### Clickable header

// TODO: this should be a simple button, not a data-left-column-block-header component

// TODO: remove weird margin-bottom?

%% result %%
```
<div class="left-column-block">
  <fc-left-column-block-header action="" show-btn="true" style-apply="">
    <h3>Click me</h3>
    <span><a class="btn-plus">+</a></span>
  </fc-left-column-block-header>
</div>
```
### Left-block lists

%% result %%
```
<div class="s-block">
  <fc-left-column-block-header class="s-block-header">
    <h3>Item list</h3>
  </fc-left-column-block-header>
  <div class="s-block-content s-block-content-type2 s-block-reduce-size">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>
</div>
```
